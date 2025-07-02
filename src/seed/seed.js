import { PrismaClient } from '../generated/prisma/index.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

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

async function seedDatabase() {
  let SALT = parseInt(process.env.SALT);
  let salt = await bcrypt.genSalt( SALT || 10);
  const senhaHash = await bcrypt.hash("Senha12345", salt);
  
  // Função para gerar senha curta que caiba no limite de 45 caracteres do banco
  const gerarSenhaSegura = () => {
    const senhaSimples = faker.internet.password({ length: 8 }); // Senha de 8 caracteres
    return bcrypt.hash(senhaSimples, salt);
  };
  
  console.log('Preenchendo o banco de dados com dados fakes, NÃO É PRA FICAR BONITO');
  
  const users = await prisma.users.createMany({
    data: [
      { Nome: "Thalysson", Email: "thalysson140105@gmail.com", Senha: senhaHash.substring(0, 45), Avatar: null },//Tenho que colocar o refresh token do usuário aqui depois
      { Nome: "Random", Email: "random123@gmail.com", Senha: senhaHash.substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
      { Nome: faker.person.fullName(), Email: faker.internet.email(), Senha: (await gerarSenhaSegura()).substring(0, 45), Avatar: null },
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