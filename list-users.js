import { prisma } from "./src/config/prismaClient.js";

async function listUsers() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        Nome: true,
        Email: true,
        Avatar: true
      }
    });
    
    console.log("Usuários encontrados:");
    users.forEach(user => {
      console.log(`ID: ${user.id}, Nome: ${user.Nome}, Email: ${user.Email}`);
    });
    
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
