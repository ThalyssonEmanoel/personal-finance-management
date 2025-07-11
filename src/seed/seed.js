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

    // Limpar dados existentes (opcional)
    // await prisma.despesas.deleteMany();
    // await prisma.despesas_recorrentes.deleteMany();
    // await prisma.transacoes.deleteMany();
    await prisma.accounts.deleteMany();
    await prisma.users.deleteMany();
    // Resetar AUTO_INCREMENT para começar do ID 1 novamente
    console.log('Resetando contadores de ID...');
    await prisma.$executeRaw`ALTER TABLE Users AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Accounts AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw`ALTER TABLE Despesas AUTO_INCREMENT = 1`;
    // await prisma.$executeRaw`ALTER TABLE Despesas_recorrentes AUTO_INCREMENT = 1`;

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