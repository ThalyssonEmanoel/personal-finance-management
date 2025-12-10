import { prisma } from "../config/prismaClient.js";
import bcrypt from "bcryptjs";
import UserRepository from "../repositories/UserRepository.js"
class AuthRepository {
  static async login(email, password) {
    const usuario = await prisma.users.findUnique({
      where: { email: email }
    });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      throw {
        code: 401,
        message: "Email ou senha inválidos.",
      };
    }
    const { password: _, refreshToken: s, ...usuarioSemSenha } = usuario;

    return usuarioSemSenha;
  }

  static async updateTokens(userId, refreshToken) {
    await UserRepository.updateUser(userId, { refreshToken });
  }
  static async invalidateRefreshToken(userId) {
    // Verificar se o usuário existe
    const existingUser = await prisma.users.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!existingUser) {
      throw { code: 404, message: "Usuário não encontrado" };
    }

    // Verificar se o usuário tem refresh token
    if (!existingUser.refreshToken) {
      throw { code: 401, message: "Usuário já está sem refresh token" };
    }

    // Invalidar o refresh token
    await prisma.users.update({
      where: { id: parseInt(userId) },
      data: { refreshToken: null }
    });

    return { message: "Refresh token invalidado com sucesso" };
  }
  static async removeTokens(userId) {
    await this.invalidateRefreshToken(userId);
  }

  static async validateRefreshToken(userId, refreshToken) {
    const usuario = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
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

  static async createResetCode({ email, code, expiresAt }) {
    return await prisma.resetCodes.create({ data: { email, code, expiresAt } });
  }

  static async findValidResetCode(email, code) {
    return await prisma.resetCodes.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  static async markCodeAsUsed(id) {
    return await prisma.resetCodes.update({
      where: { id: id },
      data: { used: true },
    });
  }

}

export default AuthRepository;
