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
    await prisma.transacoes.deleteMany();
    await prisma.formasPagamento.deleteMany();
    await prisma.accounts.deleteMany();
    await prisma.users.deleteMany();

    // Resetar AUTO_INCREMENT para começar do ID 1 novamente
    console.log('Resetando contadores de ID...');
    await prisma.$executeRaw`ALTER TABLE Users AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Accounts AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE FormasPagamento AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Transacoes AUTO_INCREMENT = 1`;

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
      { name: "Thalysson", email: "thalysson140105@gmail.com", password: senhaHash, avatar: getRandomAvatar(availableAvatars) },
      { name: "Random", email: "random123@gmail.com", password: senhaHash, avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
      { name: faker.person.fullName(), email: faker.internet.email(), password: await gerarSenhaSegura(), avatar: getRandomAvatar(availableAvatars) },
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
    { nome: "Dinheiro" },
    { nome: "Cartão de Débito" },
    { nome: "Cartão de Crédito" },
    { nome: "PIX" },
    { nome: "Transferência Bancária" },
    { nome: "Boleto" },
    { nome: "Vale Alimentação" },
    { nome: "Vale Refeição" }
  ];

  const createdPaymentMethods = await prisma.formasPagamento.createMany({ data: paymentMethods });
  console.log(` Criadas ${createdPaymentMethods.count} formas de pagamento.`);

  // Buscar todas as contas e formas de pagamento criadas
  const allAccounts = await prisma.accounts.findMany();
  const allPaymentMethods = await prisma.formasPagamento.findMany();

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
    // Cada conta terá entre 5 e 15 transações
    const numTransactions = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < numTransactions; i++) {
      const tipo = faker.helpers.arrayElement(["despesa", "receita"]);
      const isExpense = tipo === "despesa";

      const categories = isExpense ? expenseCategories : incomeCategories;
      const categoria = faker.helpers.arrayElement(categories);
      const subcategorias = subcategoriesMap[categoria] || ["Outros"];
      const subcategoria = faker.helpers.arrayElement(subcategorias);

      // Gerar nome da transação baseado na categoria
      let nome;
      switch (categoria) {
        case "Alimentação":
          nome = faker.helpers.arrayElement(["Supermercado Extra", "McDonald's", "Padaria", "iFood", "Açaí"]);
          break;
        case "Transporte":
          nome = faker.helpers.arrayElement(["Uber", "Posto Shell", "99", "Manutenção carro", "Ônibus"]);
          break;
        case "Salário":
          nome = faker.helpers.arrayElement(["Salário", "Freelance Design", "Consultoria", "Projeto Extra"]);
          break;
        default:
          nome = `${categoria} - ${faker.commerce.productName()}`;
      }

      const valor = parseFloat(faker.finance.amount(10, isExpense ? 500 : 3000, 2));
      const data_pagamento = faker.date.between({
        from: new Date('2024-01-01'),
        to: new Date('2024-12-31')
      });

      const recorrente = faker.datatype.boolean(0.2); // 20% chance de ser recorrente
      const quantidade_parcelas = !recorrente && faker.datatype.boolean(0.3)
        ? faker.number.int({ min: 2, max: 12 })
        : null;
      const parcela_atual = !recorrente && faker.datatype.boolean(0.3)
        ? faker.number.int({ min: 2, max: 12 })
        : null;

      const dia_cobranca = recorrente
        ? faker.number.int({ min: 1, max: 28 })
        : null;

      transactionsData.push({
        tipo,
        nome,
        categoria,
        subcategoria,
        valor,
        data_pagamento,
        dia_cobranca,
        quantidade_parcelas,
        parcela_atual,
        recorrente,
        contaId: account.id,
        formaPagamentoId: faker.helpers.arrayElement(allPaymentMethods).id,
        userId: account.userId
      });
    }
  });

  const createdTransactions = await prisma.transacoes.createMany({ data: transactionsData });
  console.log(` Criadas ${createdTransactions.count} transações.`);

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