import { prisma } from "../config/prismaClient.js";
import bcrypt from "bcryptjs";

class AuthRepository {
  static async login(Email, Senha) {
    const usuario = await prisma.users.findUnique({
      where: { Email: Email }
    });

    if (!usuario || !(await bcrypt.compare(Senha, usuario.Senha))) {
      throw {
        code: 401,
        message: "Email ou senha inválidos.",
      };
    }
    const { Senha: _, ...usuarioSemSenha } = usuario;

    return usuarioSemSenha;
  }

  static async updateTokens(userId, refreshToken) {
    await prisma.users.update({
      where: { id: parseInt(userId) },
      data: { refreshToken }
    });
  }
}

export default AuthRepository;
