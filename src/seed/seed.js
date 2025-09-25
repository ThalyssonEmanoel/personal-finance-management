import { PrismaClient } from '../generated/prisma/index.js';
import { fa, faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { Decimal } from 'decimal.js';

const prisma = new PrismaClient();

// if (process.env.NODE_ENV === 'production') {
//   console.log('NÃO SE RODA O SEED EM PRODUÇÃO!!!');
//   process.exit(1);
// }

async function clearDatabase() {
  try {
    console.log('Apagando dados existentes...');
    await prisma.bankTransfers.deleteMany();
    await prisma.transactions.deleteMany();
    await prisma.goals.deleteMany();
    await prisma.accountPaymentMethods.deleteMany();
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
    await prisma.$executeRaw`ALTER TABLE BankTransfers AUTO_INCREMENT = 1`;

  } catch (error) {
    console.error('Erro ao limpar o banco de dados:', error);
  }
}

async function seedDatabase() {
  let SALT = parseInt(process.env.SALT);
  let salt = await bcrypt.genSalt(SALT || 10);
  const senhaHash = await bcrypt.hash("Senha@12345", salt);

  console.log('Preenchendo o banco de dados com dados fakes, NÃO É PRA FICAR BONITO');

  // --- 1. Criar os usuários ---
  const usersData = [
    { name: "Thalysson", email: "thalysson140105@gmail.com", password: senhaHash, avatar: "src/uploads/avatar1.png" },
    { name: "Gilberto", email: "gilberto.silva@ifro.edu.br", password: senhaHash, avatar: "src/uploads/avatar1.png" }
  ]
  await prisma.users.createMany({ data: usersData });
  const allUsers = await prisma.users.findMany();
  console.log(` Criado ${allUsers.length} usuários`);


  // --- 2. Criar as 4 contas específicas  ---
  const accountsData = [
    { name: "Carteira", type: "carteira", balance: 0, icon: "src/uploads/carteira-icon.png", userId: 1 },
    { name: "Carteira", type: "carteira", balance: 0, icon: "src/uploads/carteira-icon.png", userId: 2 },
    { name: "Caixa Econômica", type: "corrente", balance: 0, icon: "src/uploads/caixa-economica-federal.png", userId: 1 },
    { name: "Caixa Econômica", type: "corrente", balance: 0, icon: "src/uploads/caixa-economica-federal.png", userId: 2 },
    { name: "Banco do Brasil", type: "corrente", balance: 0, icon: "src/uploads/banco-do-brasil.png", userId: 1 },
    { name: "Banco do Brasil", type: "corrente", balance: 0, icon: "src/uploads/banco-do-brasil.png", userId: 2 },
    { name: "Nubank", type: "digital", balance: 0, icon: "src/uploads/nubank.png", userId: 1 },
    { name: "Nubank", type: "digital", balance: 0, icon: "src/uploads/nubank.png", userId: 2 }
  ];

  const createdAccounts = await prisma.accounts.createMany({ data: accountsData });
  console.log(` Criadas ${createdAccounts.count} contas para os usuários.`);

  // --- 3 Criar métodos de pagamento---

  const paymentMethods = [
    { name: "Dinheiro" },
    { name: "Cartão de Débito" },
    { name: "Cartão de Crédito" },
    { name: "PIX" },
    { name: "Transferência Bancária" }
  ];

  const createdPaymentMethods = await prisma.paymentMethods.createMany({ data: paymentMethods });
  console.log(` Criadas ${createdPaymentMethods.count} formas de pagamento.`);

  const accountPaymentMethodsData = [
    { accountId: 1, paymentMethodId: 1 },
    { accountId: 2, paymentMethodId: 1 },
    { accountId: 1, paymentMethodId: 2 },
    { accountId: 2, paymentMethodId: 2 },
    { accountId: 1, paymentMethodId: 3 },
    { accountId: 2, paymentMethodId: 3 },
    { accountId: 1, paymentMethodId: 4 },
    { accountId: 2, paymentMethodId: 4 },
    { accountId: 1, paymentMethodId: 5 },
    { accountId: 2, paymentMethodId: 5 },
    { accountId: 3, paymentMethodId: 1 },
    { accountId: 4, paymentMethodId: 1 },
    { accountId: 3, paymentMethodId: 2 },
    { accountId: 4, paymentMethodId: 2 },
    { accountId: 3, paymentMethodId: 3 },
    { accountId: 4, paymentMethodId: 3 },
    { accountId: 3, paymentMethodId: 4 },
    { accountId: 4, paymentMethodId: 4 },
    { accountId: 3, paymentMethodId: 5 },
    { accountId: 4, paymentMethodId: 5 },
  ]

  const createdAccountPaymentMethods = await prisma.accountPaymentMethods.createMany({ data: accountPaymentMethodsData });
  console.log(` Criados ${createdAccountPaymentMethods.count} relacionamentos entre contas e métodos de pagamento.`);

  // --- 4. Criar transações ---

  const getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const expenseTemplates = [
    { category: 'Alimentação', description: 'Restaurante' },
    { category: 'Transporte', description: 'App de mobilidade' },
    { category: 'Moradia', description: 'Conta de luz' },
    { category: 'Lazer', description: 'Ingresso de cinema' },
    { category: 'Saúde', description: 'Farmácia' },
    { category: 'Compras', description: 'Loja de roupas' },
  ];

  const incomeTemplates = [
    { category: 'Salário', description: 'Adiantamento quinzenal' },
    { category: 'Freelance', description: 'Projeto de Design' },
    { category: 'Vendas', description: 'Venda de produto online' },
    { category: 'Investimentos', description: 'Recebimento de dividendos' },
  ];

  const transactionsToCreate = [];
  const allAccountsCreated = await prisma.accounts.findMany();
  const transactionsPerType = 48;
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-12-30');

  for (const user of allUsers) {
    const userAccounts = allAccountsCreated.filter(acc => acc.userId === user.id);
    if (userAccounts.length === 0) continue;

    const userAccountIds = userAccounts.map(acc => acc.id);

    // Criar 10 despesas (expense)
    for (let i = 0; i < transactionsPerType; i++) {
      const template = getRandomItem(expenseTemplates);
      transactionsToCreate.push({
        name: faker.finance.transactionType(),
        value: new Decimal(Math.random() * (500 - 20) + 20).toDecimalPlaces(2),
        type: 'expense',
        category: template.category,
        description: template.description,
        release_date: getRandomDate(startDate, endDate),
        accountId: getRandomItem(userAccountIds),
        paymentMethodId: getRandomItem([1, 2, 3, 4, 5]),
        userId: user.id,
      });
    }

    // Criar 10 receitas (income)
    for (let i = 0; i < transactionsPerType; i++) {
      const template = getRandomItem(incomeTemplates);
      transactionsToCreate.push({
        name: faker.finance.transactionType(),
        value: new Decimal(Math.random() * (2500 - 500) + 500).toDecimalPlaces(2),
        type: 'income',
        category: template.category,
        description: template.description,
        release_date: getRandomDate(startDate, endDate),
        accountId: getRandomItem(userAccountIds),
        paymentMethodId: getRandomItem([1, 2, 3, 4, 5]),
        userId: user.id,
      });
    }
  }

  const createdResult = await prisma.transactions.createMany({ data: transactionsToCreate });

  console.log(`Criadas ${createdResult.count} transações com sucesso.`);

  // --- 6. Criar transferências bancárias ---
  const bankTransfersData = [
    { amount: 100, transfer_date: new Date('2025-01-01'), description: "Transferência do dia 01 de janeiro de 2025", sourceAccountId: 1, destinationAccountId: 3, paymentMethodId: 5, userId: 1 },
    { amount: 100, transfer_date: new Date('2025-01-01'), description: "Transferência do dia 01 de janeiro de 2025", sourceAccountId: 2, destinationAccountId: 4, paymentMethodId: 5, userId: 2 },
    { amount: 50.53, transfer_date: new Date('2025-01-02'), description: "Transferência do dia 02 de janeiro de 2025", sourceAccountId: 3, destinationAccountId: 1, paymentMethodId: 5, userId: 1 },
    { amount: 50.53, transfer_date: new Date('2025-01-02'), description: "Transferência do dia 02 de janeiro de 2025", sourceAccountId: 4, destinationAccountId: 2, paymentMethodId: 5, userId: 2 },
    { amount: 10, transfer_date: new Date('2025-01-03'), description: "Transferência do dia 03 de janeiro de 2025", sourceAccountId: 1, destinationAccountId: 3, paymentMethodId: 5, userId: 1 },
    { amount: 10, transfer_date: new Date('2025-01-03'), description: "Transferência do dia 03 de janeiro de 2025", sourceAccountId: 2, destinationAccountId: 4, paymentMethodId: 5, userId: 2 },
  ]

  const createdBankTransfers = await prisma.bankTransfers.createMany({ data: bankTransfersData });
  console.log(` Criadas ${createdBankTransfers.count} transferências bancárias.`);

  console.log('Calculando balance final das contas (transações e transferências)...');
  const allAccountsForBalance = await prisma.accounts.findMany();

  for (const account of allAccountsForBalance) {
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

  // --- 7. Criar metas financeiras ---
  const goalsData = [];

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
      const incomeGoalDate = new Date(2024, month, 15);
      const incomeGoalName = faker.helpers.arrayElement(incomeGoalNames);
      const incomeGoalValue = faker.number.float({ min: 2000, max: 8000, precision: 0.01 });
      goalsData.push({
        name: `${incomeGoalName} - ${incomeGoalDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
        date: incomeGoalDate,
        transaction_type: 'income',
        value: incomeGoalValue,
        userId: user.id
      });
      const expenseGoalDate = new Date(2024, month, 15);
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