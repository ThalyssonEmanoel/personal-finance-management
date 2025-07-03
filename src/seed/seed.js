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
    await prisma.users.deleteMany();
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
} s

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
  const senhaHash = await bcrypt.hash("Senha12345", salt);

  // Obter avatares disponíveis
  const availableAvatars = getAvailableAvatars();
  console.log(`Encontrados ${availableAvatars.length} avatares disponíveis:`, availableAvatars);

  const gerarSenhaSegura = () => {
    const senhaSimples = faker.internet.password({ length: 8 });
    return bcrypt.hash(senhaSimples, salt);
  };

  console.log('Preenchendo o banco de dados com dados fakes, NÃO É PRA FICAR BONITO');

  const users = await prisma.users.createMany({
    data: [
      { Nome: "Thalysson", Email: "thalysson140105@gmail.com", Senha: senhaHash.substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },//Tenho que colocar o refresh token do usuário aqui depois
      { Nome: "Random", Email: "random123@gmail.com", Senha: senhaHash.substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: getRandomAvatar(availableAvatars) },
    ],
  });

  console.log(` Criados ${users.count} usuários`);
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