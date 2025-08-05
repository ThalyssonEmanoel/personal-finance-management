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
        avatar: true,
        isAdmin: true
      },
    });
    if (!result || result.length === 0) {
      throw { code: 404, message: "Nenhum usuário encontrado" };
    }
    return result
  }
  static async contUsers(filtros = {}) {
    return await prisma.users.count({
      where: filtros
    });
  }

  static async getUserById(id) {
    return await prisma.users.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        password: true, // Incluir senha para verificação
        avatar: true,
        isAdmin: false
      }
    });
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
        avatar: avatar || null,
        isAdmin: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        avatar: true,
        isAdmin: false
      }
    });
  }

  static async createUserAdmin(userData) {
    const { name, email, password, avatar, isAdmin } = userData;

    // Verificar se o email já existe
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw { code: 409, message: "Email já cadastrado" };
    }

    // Criar o novo usuário com permissão de admin definida
    return await prisma.users.create({
      data: {
        name: name,
        email,
        password,
        avatar: avatar || null,
        isAdmin: isAdmin || false
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        avatar: true,
        isAdmin: true
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

    // Atualizar o usuário
    const updateData = {};
    if (name !== undefined && name !== null && name !== "") updateData.name = name;
    if (email !== undefined && email !== null && email !== "") updateData.email = email;
    if (password !== undefined && password !== null && password !== "") updateData.password = password;
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
        avatar: true,
        isAdmin: false
      }
    });
  }

  static async updateUserAdmin(id, userData) {
    const { name, email, password, avatar, refreshToken, isAdmin } = userData;

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

    // Atualizar o usuário (admin pode alterar qualquer campo incluindo isAdmin)
    const updateData = {};
    if (name !== undefined && name !== null && name !== "") updateData.name = name;
    if (email !== undefined && email !== null && email !== "") updateData.email = email;
    if (password !== undefined && password !== null && password !== "") updateData.password = password;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (refreshToken !== undefined) updateData.refreshToken = refreshToken;
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;

    return await prisma.users.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        avatar: true,
        isAdmin: true
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

    try {
      await prisma.$transaction(async (prisma) => {
        await prisma.transactions.deleteMany({
          where: { userId: parseInt(id) }
        });

        await prisma.accountPaymentMethods.deleteMany({
          where: {
            account: {
              userId: parseInt(id)
            }
          }
        });

        await prisma.accounts.deleteMany({
          where: { userId: parseInt(id) }
        });

        await prisma.users.delete({
          where: { id: parseInt(id) }
        });
      });

      return { message: "Usuário e todos os dados relacionados foram deletados com sucesso" };
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }
}

export default UserRepository;
