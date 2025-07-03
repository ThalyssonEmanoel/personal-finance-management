import AuthService from "./src/services/AuthService.js";
import { prisma } from "./src/config/prismaClient.js";
import bcrypt from "bcryptjs";

async function testWithExistingUser() {
  try {
    console.log("Testando com usuário existente...");
    
    // Vamos pegar o primeiro usuário e atualizar sua senha para um valor conhecido
    const firstUser = await prisma.users.findFirst();
    console.log(`Usuário encontrado: ${firstUser.Email}`);
    
    // Atualizar a senha do usuário para "123456"
    const hashedPassword = await bcrypt.hash("123456", 10);
    await prisma.users.update({
      where: { id: firstUser.id },
      data: { Senha: hashedPassword }
    });
    
    console.log("Senha atualizada para '123456'");
    
    // Testar login
    console.log("Testando login...");
    const loginData = {
      email: firstUser.Email,
      senha: "123456"
    };
    
    const result = await AuthService.login(loginData);
    console.log("✅ Login realizado com sucesso!");
    console.log("✅ Access Token gerado:", result.accessToken ? "SIM" : "NÃO");
    console.log("✅ Refresh Token gerado:", result.refreshToken ? "SIM" : "NÃO");
    console.log("✅ Dados do usuário:", {
      id: result.usuario.id,
      nome: result.usuario.Nome,
      email: result.usuario.Email
    });
    
    // Verificar se o refresh token foi salvo no banco
    const userWithToken = await prisma.users.findUnique({
      where: { id: firstUser.id },
      select: { refreshToken: true }
    });
    
    console.log("✅ Refresh Token salvo no banco:", userWithToken.refreshToken ? "SIM" : "NÃO");
    
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testWithExistingUser();
