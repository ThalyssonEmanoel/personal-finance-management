import { PrismaClient } from '../generated/prisma/index.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

if (process.env.NODE_ENV === 'production') {
  console.log('NÃO SE RODA O SEED EM PRODUÇÃO!!!');
  process.exit(1);
}

async function clearDatabase() {
  try {
    console.log('Apagando dados existentes...');

    // Limpar dados existentes (optional)
    await prisma.bankTransfers.deleteMany();
    await prisma.transactions.deleteMany();
    await prisma.paymentMethods.deleteMany();
    await prisma.accounts.deleteMany();
    await prisma.users.deleteMany();

    // Resetar AUTO_INCREMENT para começar do ID 1 novamente
    console.log('Resetando contadores de ID...');
    await prisma.$executeRaw`ALTER TABLE Users AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Accounts AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE PaymentMethods AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Transactions AUTO_INCREMENT = 1`;

  } catch (error) {
    console.error('Erro ao limpar o banco de dados:', error);
  }
}

// Função para obter avatares disponíveis
function getAvailableAvatars() {
  const avatarPaths = [];

  // Adicionar avatares da pasta images que a pasta de imagns pro seed que eu criei
  const imagesDir = path.join(process.cwd(), 'src', 'seed', 'images');
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir);
    imageFiles.forEach(file => {
      if (file.match(/\.(png|jpg|jpeg|gif)$/i)) {
        avatarPaths.push(`src/seed/images/${file}`);
      }
    });
  }

  return avatarPaths;
}

/**
*@getRandomAvatar Função para selecionar avatar aleatório 
*/
function getRandomAvatar(avatars) {
  if (avatars.length === 0) return null;
  return avatars[Math.floor(Math.random() * avatars.length)];
}

async function seedDatabase() {
  let SALT = parseInt(process.env.SALT);
  let salt = await bcrypt.genSalt(SALT || 10);
  const senhaHash = await bcrypt.hash("Senha@12345", salt);

  const availableAvatars = getAvailableAvatars();
  console.log(`Encontrados ${availableAvatars.length} avatares disponíveis:`, availableAvatars);

  const gerarSenhaSegura = () => {
    const senhaSimples = faker.internet.password({ length: 8 });
    return bcrypt.hash(senhaSimples, salt);
  };

  console.log('Preenchendo o banco de dados com dados fakes, NÃO É PRA FICAR BONITO');

  const users = await prisma.users.createMany({
    data: [
      { name: "Thalysson", email: "thalysson140105@gmail.com", password: senhaHash, avatar: getRandomAvatar(availableAvatars), isAdmin: true },
      { name: "Random", email: "random123@gmail.com", password: senhaHash, avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars), isAdmin: false },
    ],
  });

  console.log(` Criados ${users.count} usuários`);

  const allUsers = await prisma.users.findMany();

  const accountTypes = ["corrente", "poupanca", "investimento", "carteira", "digital"];

  const accountsData = allUsers.flatMap(user => {
    const numAccounts = faker.number.int({ min: 1, max: 3 });
    return Array.from({ length: numAccounts }, () => ({
      name: faker.finance.accountName(),
      type: faker.helpers.arrayElement(accountTypes),
      balance: parseFloat(faker.finance.amount(0, 10000, 2)),
      icon: getRandomAvatar(availableAvatars),
      userId: user.id
    }));
  });

  const createdAccounts = await prisma.accounts.createMany({ data: accountsData });
  console.log(` Criadas ${createdAccounts.count} contas para os usuários.`);

  // Criar formas de pagamento
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

  // Buscar todas as contas e formas de pagamento criadas
  const allAccounts = await prisma.accounts.findMany();
  const allPaymentMethods = await prisma.paymentMethods.findMany();

  // Criar relacionamentos entre contas e métodos de pagamento
  const accountPaymentMethodsData = [];
  
  allAccounts.forEach(account => {
    // Definir quais métodos de pagamento são compatíveis com cada tipo de conta
    let compatiblePaymentMethods = [];
    
    switch (account.type.toLowerCase()) {
      case 'carteira':
        // Carteira só aceita dinheiro
        compatiblePaymentMethods = allPaymentMethods.filter(pm => pm.name === "Dinheiro");
        break;
      case 'corrente':
      case 'poupanca':
        // Contas bancárias aceitam quase todos os métodos, exceto vale alimentação/refeição
        compatiblePaymentMethods = allPaymentMethods.filter(pm => 
          !pm.name.includes("Vale")
        );
        break;
      case 'digital':
        // Contas digitais aceitam métodos eletrônicos
        compatiblePaymentMethods = allPaymentMethods.filter(pm => 
          ["PIX", "Cartão de Débito", "Cartão de Crédito", "Transferência Bancária"].includes(pm.name)
        );
        break;
      case 'investimento':
        // Conta de investimento aceita transferências e PIX principalmente
        compatiblePaymentMethods = allPaymentMethods.filter(pm => 
          ["PIX", "Transferência Bancária", "Cartão de Débito"].includes(pm.name)
        );
        break;
      default:
        // Para outros tipos, aceita métodos básicos
        compatiblePaymentMethods = allPaymentMethods.filter(pm => 
          ["Dinheiro", "PIX", "Cartão de Débito", "Cartão de Crédito"].includes(pm.name)
        );
    }

    // Criar relacionamento para cada método compatível
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

  // Categorias para transações
  const expenseCategories = [
    "Alimentação", "Transporte", "Moradia", "Saúde", "Educação",
    "Entretenimento", "Roupas", "Tecnologia", "Viagem", "Outros"
  ];

  const incomeCategories = [
    "Salário", "Freelance", "Investimentos", "Vendas", "Presente",
    "Reembolso", "Renda Extra", "Outros"
  ];

  const subcategoriesMap = {
    "Alimentação": ["Supermercado", "Restaurante", "Lanche", "Delivery"],
    "Transporte": ["Combustível", "Uber", "Ônibus", "Manutenção"],
    "Moradia": ["Aluguel", "Condomínio", "Energia", "Internet", "Água"],
    "Saúde": ["Médico", "Farmácia", "Exames", "Plano de Saúde"],
    "Educação": ["Curso", "Livros", "Material Escolar", "Mensalidade"],
    "Entretenimento": ["Cinema", "Teatro", "Streaming", "Jogos"],
    "Roupas": ["Casual", "Formal", "Esportiva", "Calçados"],
    "Tecnologia": ["Software", "Hardware", "Celular", "Computador"],
    "Viagem": ["Passagem", "Hotel", "Alimentação", "Turismo"],
    "Salário": ["CLT", "Freelance", "Comissão"],
    "Investimentos": ["Dividendos", "Rendimentos", "Venda de Ações"],
    "Outros": ["Diversos", "Variado"]
  };

  // Gerar transações
  const transactionsData = [];

  allAccounts.forEach(account => {
    // Buscar métodos de pagamento compatíveis com esta conta
    const accountPaymentMethods = accountPaymentMethodsData.filter(
      apm => apm.accountId === account.id
    );
    
    if (accountPaymentMethods.length === 0) {
      console.warn(`Conta ${account.name} (ID: ${account.id}) não tem métodos de pagamento compatíveis!`);
      return;
    }

    // Cada conta terá entre 5 e 15 transações
    const numTransactions = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < numTransactions; i++) {
      const type = faker.helpers.arrayElement(["expense", "income"]);
      const isExpense = type === "expense";

      const categories = isExpense ? expenseCategories : incomeCategories;
      const category = faker.helpers.arrayElement(categories);

      // Gerar nome da transação baseado na categoria
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
        from: new Date('2024-01-01'),
        to: new Date('2024-12-31')
      });

      const recurring = faker.datatype.boolean(0.2); // 20% chance de ser recorrente
      const number_installments = !recurring && faker.datatype.boolean(0.3)
        ? faker.number.int({ min: 2, max: 12 })
        : null;
      const current_installment = !recurring && faker.datatype.boolean(0.3)
        ? faker.number.int({ min: 2, max: 12 })
        : null;

      // Selecionar um método de pagamento compatível com a conta
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

  const bankTransfersData = [];

  allUsers.forEach(user => {
    const userAccounts = allAccounts.filter(account => account.userId === user.id);
    
    if (userAccounts.length < 2) {
      console.warn(`Usuário ${user.name} tem menos de 2 contas, não pode fazer transferências internas`);
      return;
    }

    // Cada usuário terá 2 transferências bancárias
    for (let i = 0; i < 2; i++) {
      // Selecionar conta de origem e destino aleatoriamente
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

      // Preferir métodos eletrônicos para transferências
      const preferredMethods = sourceAccountPaymentMethods.filter(apm => {
        const method = allPaymentMethods.find(pm => pm.id === apm.paymentMethodId);
        return ["PIX", "Transferência Bancária", "Cartão de Débito"].includes(method.name);
      });

      const selectedMethod = preferredMethods.length > 0 
        ? faker.helpers.arrayElement(preferredMethods)
        : faker.helpers.arrayElement(sourceAccountPaymentMethods);

      const amount = parseFloat(faker.finance.amount(50, 1000, 2));
      const transfer_date = faker.date.between({
        from: new Date('2024-01-01'),
        to: new Date('2024-12-31')
      });

      const descriptions = [
        "Transferência para conta poupança",
        "Movimentação entre contas",
        "Transferência para investimento",
        "Organização financeira",
        "Transferência interna",
        null
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
  });

  const createdBankTransfers = await prisma.bankTransfers.createMany({ data: bankTransfersData });
  console.log(` Criadas ${createdBankTransfers.count} transferências bancárias.`);

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