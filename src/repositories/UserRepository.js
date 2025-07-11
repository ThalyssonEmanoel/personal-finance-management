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
        name: true,
        email: true,
        password: false,
        avatar: true
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
    const { name, email, password, avatar } = userData;

    // Verificar se o email já existe
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw { code: 409, message: "Email já cadastrado" };
    }

    // Criar o novo usuário
    return await prisma.users.create({
      data: {
        name: name,
        email,
        password,
        avatar: avatar || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        avatar: true
      }
    });
  }

  static async updateUser(id, userData) {
    const { name, email, password, avatar, refreshToken } = userData;

    // Verificar se o usuário existe
    const existingUser = await prisma.users.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      throw { code: 404, message: "Usuário não encontrado" };
    }

    // Verificar se o email já existe em outro usuário
    if (email) {
      const emailExists = await prisma.users.findFirst({
        where: {
          email,
          id: { not: parseInt(id) }
        }
      });
      if (emailExists) {
        throw { code: 409, message: "Email já cadastrado por outro usuário" };
      }
    }
    if (email) {
      const emailExists = await prisma.users.findFirst({
        where: {
          email,
        }
      });
      if (emailExists) {
        throw { code: 409, message: "Email a ser atualizado não pode ser o mesmo que o existente no sistema." };
      }
    }

    // Atualizar o usuário
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (refreshToken !== undefined) updateData.refreshToken = refreshToken;

    return await prisma.users.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        avatar: true
      }
    });
  }

  static async deleteUser(id) {
    // Verificar se o usuário existe
    const existingUser = await prisma.users.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      throw { code: 404, message: "Usuário não encontrado" };
    }

    // Deletar o usuário
    await prisma.users.delete({
      where: { id: parseInt(id) }
    });

    return { message: "Usuário deletado com sucesso" };
  }
}

export default UserRepository;
