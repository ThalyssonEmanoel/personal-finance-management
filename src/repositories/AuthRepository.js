import { prisma } from "../config/prismaClient.js";
import bcrypt from "bcryptjs";
import UserRepository from "../repositories/UserRepository.js"
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
    await UserRepository.updateUser(userId, { refreshToken });
  }

  static async removeTokens(userId) {
    await UserRepository.invalidateRefreshToken(userId);
  }

  static async validateRefreshToken(userId, refreshToken) {
    const usuario = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        Nome: true,
        Email: true,
        refreshToken: true
      }
    });

    if (!usuario) {
      throw { code: 404, message: "Usuário não encontrado." };
    }
    
    if (!usuario.refreshToken || usuario.refreshToken !== refreshToken) {
      throw { code: 401, message: "Refresh token inválido." };
    }

    const { refreshToken: _, ...usuarioSemToken } = usuario;
    return usuarioSemToken;
  }

}

export default AuthRepository;
