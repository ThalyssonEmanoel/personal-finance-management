import AuthService from "./src/services/AuthService.js";
import { prisma } from "./src/config/prismaClient.js";
import bcrypt from "bcryptjs";

async function testLogin() {
  try {
    console.log("Testando a autenticação com Prisma...");
    
    // Primeiro, vamos verificar se existe algum usuário na base
    const users = await prisma.users.findMany();
    console.log(`Encontrados ${users.length} usuários na base de dados`);
    
    if (users.length === 0) {
      console.log("Criando usuário de teste...");
      
      // Criar um usuário de teste
      const hashedPassword = await bcrypt.hash("123456", 10);
      const testUser = await prisma.users.create({
        data: {
          Nome: "Usuário Teste",
          Email: "teste@exemplo.com",
          Senha: hashedPassword,
          Avatar: null
        }
      });
      
      console.log("Usuário de teste criado:", testUser.Email);
    }
    
    // Testar login
    console.log("Testando login...");
    const loginData = {
      email: "teste@exemplo.com",
      senha: "123456"
    };
    
    const result = await AuthService.login(loginData);
    console.log("Login realizado com sucesso!");
    console.log("Access Token gerado:", result.accessToken ? "✓" : "✗");
    console.log("Refresh Token gerado:", result.refreshToken ? "✓" : "✗");
    console.log("Dados do usuário:", {
      id: result.usuario.id,
      nome: result.usuario.Nome,
      email: result.usuario.Email
    });
    
  } catch (error) {
    console.error("Erro no teste:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
