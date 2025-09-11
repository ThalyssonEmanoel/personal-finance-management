import { PrismaClient } from '../generated/prisma/index.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { Decimal } from 'decimal.js';

const prisma = new PrismaClient();

// if (process.env.NODE_ENV === 'production') {
//   console.log('NÃO SE RODA O SEED EM PRODUÇÃO!!!');
//   process.exit(1);
// }

async function clearDatabase() {
  try {
    console.log('Apagando dados existentes...');

    // Limpar dados existentes (optional)
    await prisma.bankTransfers.deleteMany();
    await prisma.transactions.deleteMany();
    await prisma.goals.deleteMany();
    await prisma.accountPaymentMethods.deleteMany(); // Adicionado para limpar a tabela de junção
    await prisma.paymentMethods.deleteMany();
    await prisma.accounts.deleteMany();
    await prisma.users.deleteMany();

    // Resetar AUTO_INCREMENT para começar do ID 1 novamente
    console.log('Resetando contadores de ID...');
    await prisma.$executeRaw`ALTER TABLE Users AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Accounts AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE PaymentMethods AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Transactions AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Goals AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE BankTransfers AUTO_INCREMENT = 1`; // Adicionado para resetar BankTransfers

  } catch (error) {
    console.error('Erro ao limpar o banco de dados:', error);
  }
}

async function seedDatabase() {
  let SALT = parseInt(process.env.SALT);
  let salt = await bcrypt.genSalt(SALT || 10);
  const senhaHash = await bcrypt.hash("Senha@12345", salt);

  console.log('Preenchendo o banco de dados com dados fakes, NÃO É PRA FICAR BONITO');

  // --- 1. Criar o usuário único ---
  const user = await prisma.users.create({
    data: {
      name: "Thalysson",
      email: "thalysson140105@gmail.com",
      password: senhaHash,
      avatar: "src/uploads/avatar1.png"
    },
  });

  console.log(` Criado 1 usuário`);

  // --- 2. Criar as 4 contas específicas para esse usuário ---
  const accountsData = [
    {
      name: "Carteira",
      type: "carteira",
      balance: 0,
      icon: "src/uploads/carteira-icon.png",
      userId: user.id
    },
    {
      name: "Caixa Econômica",
      type: "corrente",
      balance: 0,
      icon: "src/uploads/caixa-economica-federal.png",
      userId: user.id
    },
    {
      name: "Banco do Brasil",
      type: "corrente",
      balance: 0,
      icon: "src/uploads/banco-do-brasil.png",
      userId: user.id
    },
    {
      name: "Nubank",
      type: "digital",
      balance: 0,
      icon: "src/uploads/nubank.png",
      userId: user.id
    }
  ];

  const createdAccounts = await prisma.accounts.createMany({ data: accountsData });
  console.log(` Criadas ${createdAccounts.count} contas para o usuário.`);

  // --- O restante da lógica permanece o mesmo, adaptando-se aos dados criados ---

  const paymentMethods = [
    { name: "Dinheiro" },
    { name: "Cartão de Débito" },
    { name: "Cartão de Crédito" },
    { name: "PIX" },
    { name: "Transferência Bancária" },
    { name: "Boleto" },
    { name: "Vale Alimentação" },
    { name: "Vale Refeição" }
  ];

  const createdPaymentMethods = await prisma.paymentMethods.createMany({ data: paymentMethods });
  console.log(` Criadas ${createdPaymentMethods.count} formas de pagamento.`);

  const allAccounts = await prisma.accounts.findMany();
  const allPaymentMethods = await prisma.paymentMethods.findMany();

  const accountPaymentMethodsData = [];

  allAccounts.forEach(account => {
    let compatiblePaymentMethods = [];

    switch (account.type.toLowerCase()) {
      case 'carteira':
        compatiblePaymentMethods = allPaymentMethods.filter(pm => pm.name === "Dinheiro");
        break;
      case 'corrente':
      case 'poupanca':
        compatiblePaymentMethods = allPaymentMethods.filter(pm =>
          !pm.name.includes("Vale")
        );
        break;
      case 'digital':
        compatiblePaymentMethods = allPaymentMethods.filter(pm =>
          ["PIX", "Cartão de Débito", "Cartão de Crédito", "Transferência Bancária"].includes(pm.name)
        );
        break;
      case 'investimento':
        compatiblePaymentMethods = allPaymentMethods.filter(pm =>
          ["PIX", "Transferência Bancária", "Cartão de Débito"].includes(pm.name)
        );
        break;
      default:
        compatiblePaymentMethods = allPaymentMethods.filter(pm =>
          ["Dinheiro", "PIX", "Cartão de Débito", "Cartão de Crédito"].includes(pm.name)
        );
    }

    compatiblePaymentMethods.forEach(paymentMethod => {
      accountPaymentMethodsData.push({
        accountId: account.id,
        paymentMethodId: paymentMethod.id
      });
    });
  });

  const createdAccountPaymentMethods = await prisma.accountPaymentMethods.createMany({
    data: accountPaymentMethodsData
  });
  console.log(` Criados ${createdAccountPaymentMethods.count} relacionamentos entre contas e métodos de pagamento.`);

  const expenseCategories = [
    "Alimentação", "Transporte", "Moradia", "Saúde", "Educação",
    "Entretenimento", "Roupas", "Tecnologia", "Viagem", "Outros"
  ];

  const incomeCategories = [
    "Salário", "Freelance", "Investimentos", "Vendas", "Presente",
    "Reembolso", "Renda Extra", "Outros"
  ];

  const transactionsData = [];

  allAccounts.forEach(account => {
    const accountPaymentMethods = accountPaymentMethodsData.filter(
      apm => apm.accountId === account.id
    );

    if (accountPaymentMethods.length === 0) {
      console.warn(`Conta ${account.name} (ID: ${account.id}) não tem métodos de pagamento compatíveis!`);
      return;
    }

    const numTransactions = 10;

    for (let i = 0; i < numTransactions; i++) {
      const type = faker.helpers.arrayElement(["expense", "income"]);
      const isExpense = type === "expense";

      const categories = isExpense ? expenseCategories : incomeCategories;
      const category = faker.helpers.arrayElement(categories);

      let name;
      switch (category) {
        case "Alimentação":
          name = faker.helpers.arrayElement(["Supermercado Extra", "McDonald's", "Padaria", "iFood", "Açaí"]);
          break;
        case "Transporte":
          name = faker.helpers.arrayElement(["Uber", "Posto Shell", "99", "Manutenção carro", "Ônibus"]);
          break;
        case "Salário":
          name = faker.helpers.arrayElement(["Salário", "Freelance Design", "Consultoria", "Projeto Extra"]);
          break;
        default:
          name = `${category} - ${faker.commerce.productName()}`;
      }

      const value = parseFloat(faker.finance.amount(10, isExpense ? 500 : 3000, 2));
      const release_date = faker.date.between({
        from: new Date('2025-01-01'),
        to: new Date('2025-12-31')
      });

      const recurring = faker.datatype.boolean(0.4);
      const number_installments = !recurring && faker.datatype.boolean(0.3)
        ? faker.number.int({ min: 2, max: 12 })
        : null;
      const current_installment = number_installments
        ? faker.number.int({ min: 1, max: number_installments })
        : null;

      const randomAccountPaymentMethod = faker.helpers.arrayElement(accountPaymentMethods);

      transactionsData.push({
        type,
        name,
        category,
        value,
        release_date,
        number_installments,
        current_installment,
        recurring,
        accountId: account.id,
        paymentMethodId: randomAccountPaymentMethod.paymentMethodId,
        userId: account.userId
      });
    }
  });

  const createdTransactions = await prisma.transactions.createMany({ data: transactionsData });
  console.log(` Criadas ${createdTransactions.count} transações.`);

  console.log('Calculando balance das contas com base nas transações...');

  for (const account of allAccounts) {
    const accountTransactions = await prisma.transactions.findMany({
      where: { accountId: account.id }
    });

    let balance = new Decimal(0);

    accountTransactions.forEach(transaction => {
      const value = new Decimal(transaction.value);
      if (transaction.type === 'income') {
        balance = balance.add(value);
      } else if (transaction.type === 'expense') {
        balance = balance.sub(value);
      }
    });

    await prisma.accounts.update({
      where: { id: account.id },
      data: { balance: balance.toNumber() }
    });
  }

  console.log(' Balance das contas calculado e atualizado com sucesso!');

  const bankTransfersData = [];
  const userAccounts = allAccounts.filter(account => account.userId === user.id);

  if (userAccounts.length >= 2) {
    for (let i = 0; i < 2; i++) {
      const sourceAccount = faker.helpers.arrayElement(userAccounts);
      const availableDestinations = userAccounts.filter(acc => acc.id !== sourceAccount.id);
      const destinationAccount = faker.helpers.arrayElement(availableDestinations);
      const sourceAccountPaymentMethods = accountPaymentMethodsData.filter(
        apm => apm.accountId === sourceAccount.id
      );

      if (sourceAccountPaymentMethods.length === 0) {
        console.warn(`Conta de origem ${sourceAccount.name} não tem métodos de pagamento compatíveis!`);
        continue;
      }

      const preferredMethods = sourceAccountPaymentMethods.filter(apm => {
        const method = allPaymentMethods.find(pm => pm.id === apm.paymentMethodId);
        return ["PIX", "Transferência Bancária", "Cartão de Débito"].includes(method.name);
      });

      const selectedMethod = preferredMethods.length > 0
        ? faker.helpers.arrayElement(preferredMethods)
        : faker.helpers.arrayElement(sourceAccountPaymentMethods);

      const amount = parseFloat(faker.finance.amount(50, 1000, 2));
      const transfer_date = faker.date.between({
        from: new Date('2025-01-01'),
        to: new Date('2025-12-31')
      });

      const descriptions = [
        "Transferência para conta poupança", "Movimentação entre contas",
        "Transferência para investimento", "Organização financeira",
        "Transferência interna", null
      ];

      bankTransfersData.push({
        amount,
        transfer_date,
        description: faker.helpers.arrayElement(descriptions),
        sourceAccountId: sourceAccount.id,
        destinationAccountId: destinationAccount.id,
        paymentMethodId: selectedMethod.paymentMethodId,
        userId: user.id
      });
    }
  }

  const createdBankTransfers = await prisma.bankTransfers.createMany({ data: bankTransfersData });
  console.log(` Criadas ${createdBankTransfers.count} transferências bancárias.`);

  console.log('Recalculando balance das contas incluindo transferências bancárias...');

  const updatedAccounts = await prisma.accounts.findMany();

  for (const account of updatedAccounts) {
    const accountTransactions = await prisma.transactions.findMany({
      where: { accountId: account.id }
    });

    const outgoingTransfers = await prisma.bankTransfers.findMany({
      where: { sourceAccountId: account.id }
    });

    const incomingTransfers = await prisma.bankTransfers.findMany({
      where: { destinationAccountId: account.id }
    });

    let balance = new Decimal(0);

    accountTransactions.forEach(transaction => {
      const value = new Decimal(transaction.value);
      if (transaction.type === 'income') {
        balance = balance.add(value);
      } else if (transaction.type === 'expense') {
        balance = balance.sub(value);
      }
    });

    outgoingTransfers.forEach(transfer => {
      const amount = new Decimal(transfer.amount);
      balance = balance.sub(amount);
    });

    incomingTransfers.forEach(transfer => {
      const amount = new Decimal(transfer.amount);
      balance = balance.add(amount);
    });

    await prisma.accounts.update({
      where: { id: account.id },
      data: { balance: balance.toNumber() }
    });
  }

  console.log(' Balance final das contas calculado com sucesso!');

  const goalsData = [];
  const allUsers = [user]; // Use the single user created earlier

  allUsers.forEach(user => {
    const incomeGoalNames = [
      'Meta de Renda Mensal', 'Objetivo de Freelances', 'Meta de Vendas',
      'Receita Extra', 'Renda de Investimentos', 'Meta de Salário'
    ];

    const expenseGoalNames = [
      'Controle de Gastos', 'Limite de Entretenimento', 'Meta de Economia',
      'Redução de Despesas', 'Controle Alimentação', 'Limite Compras', 'Meta Transporte'
    ];

    for (let month = 0; month < 12; month++) {
      const incomeGoalDate = new Date(2025, month, 15);
      const incomeGoalName = faker.helpers.arrayElement(incomeGoalNames);
      const incomeGoalValue = faker.number.float({ min: 2000, max: 8000, precision: 0.01 });
      goalsData.push({
        name: `${incomeGoalName} - ${incomeGoalDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
        date: incomeGoalDate,
        transaction_type: 'income',
        value: incomeGoalValue,
        userId: user.id
      });
      const expenseGoalDate = new Date(2025, month, 15);
      const expenseGoalName = faker.helpers.arrayElement(expenseGoalNames);
      const expenseGoalValue = faker.number.float({ min: 500, max: 3000, precision: 0.01 });
      goalsData.push({
        name: `${expenseGoalName} - ${expenseGoalDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
        date: expenseGoalDate,
        transaction_type: 'expense',
        value: expenseGoalValue,
        userId: user.id
      });
    }
  });

  const createdGoals = await prisma.goals.createMany({ data: goalsData });
  console.log(` Criadas ${createdGoals.count} metas financeiras (24 metas por usuário: 12 de receita e 12 de despesa para todos os meses de 2025).`);

  console.log(' Seed concluído com sucesso!');
}

async function main() {
  await clearDatabase();
  await seedDatabase();
}

main().catch((e) => {
  console.error('Erro durante o seed:', e);
  process.exit(1);
}).finally(async () => { await prisma.$disconnect(); });