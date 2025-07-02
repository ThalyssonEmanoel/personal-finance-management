import { prisma } from "../config/prismaClient.js";

class UserRepository {

  static async listUsers(filtros, skip, take, order) {
    const where = {
      ...filtros,
    };
    const result = await prisma.users.findMany({
      where,
      skip: skip,
      take: take,
      orderBy: { id: order },
      select: {
        id: true,
        Nome: true,
        Email: true,
        Senha: false,
        Avatar: true
      },
    });
    if (!result || result.length === 0) {
      throw { code: 404, message: "Nenhum usuário encontrado" };
    }
    return result
  }
  static async contUsers() {
    return await prisma.users.count();
  }

  static async createUser(userData) {
    const { Nome, Email, Senha, Avatar } = userData;

    // Verificar se o email já existe
    const existingUser = await prisma.users.findUnique({
      where: { Email }
    });

    if (existingUser) {
      throw { code: 409, message: "Email já cadastrado" };
    }

    // Criar o novo usuário
    return await prisma.users.create({
      data: {
        Nome: Nome,
        Email,
        Senha,
        Avatar: Avatar || null
      },
      select: {
        id: true,
        Nome: true,
        Email: true,
        Senha: false,
        Avatar: true
      }
    });
  }
}

export default UserRepository;
