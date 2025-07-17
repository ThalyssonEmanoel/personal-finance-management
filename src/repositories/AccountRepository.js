import { prisma } from "../config/prismaClient.js";

class AccountRepository {

  static async listAccounts(filtros, skip, take, order) {
    const { userName, ...otherFilters } = filtros;
    let where = { ...otherFilters };
    if (userName) {
      where.usuario = {
        name: { contains: userName }
      };
    }
    const result = await prisma.accounts.findMany({
      where,
      skip: skip,
      take: take,
      orderBy: { id: order },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        icon: true,
        userId: true
      },
    });
    if (result.length === 0) {
      throw { code: 404, message: "Nenhuma conta encontrada" };
    }
    return result;
  }

  static async contAccounts() {
    return await prisma.accounts.count();
  }

  static async createAccount(accountData) {
    const { name, type, balance, icon, userId } = accountData;
    
    //o normalize é usado para remover acentos e comparar nomes de forma consistente, apenas para evitar duplicatas
    const normalize = (str) => str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    const normalizedNome = normalize(name);
    const normalizedType = normalize(type);
    const existingAccounts = await prisma.accounts.findMany({
      where: {
        type,
        usuario: { id: userId }
      }
    });
    const similar = existingAccounts.find(acc => normalize(acc.name) === normalizedNome && normalize(acc.type) === normalizedType);
    if (similar) {
      throw { code: 409, message: "Já existe uma conta com nome semelhante e tipo para este usuário." };
    }
    const data = {
      name,
      type,
      balance,
      usuario: { connect: { id: userId } },
      icon: icon !== undefined ? icon : ""
    };
    return await prisma.accounts.create({
      data,
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        icon: true,
        userId: true
      }
    });
  }

  static async updateAccount(id, accountData) {
    const existingAccount = await prisma.accounts.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingAccount) {
      throw { code: 404, message: "Conta não encontrada" };
    }
    if (accountData.name && accountData.type && accountData.userId) {
      const normalize = (str) => str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
      const normalizedNome = normalize(accountData.name);
      const existingAccounts = await prisma.accounts.findMany({
        where: {
          type: accountData.type,
          usuario: { id: accountData.userId },
          NOT: { id: parseInt(id) }
        }
      });
      const similar = existingAccounts.find(acc => normalize(acc.name) === normalizedNome);
      if (similar) {
        throw { code: 409, message: "Já existe uma conta com nome semelhante para este usuário." };
      }
    }
    const updateData = {};
    if (accountData.name) updateData.name = accountData.name;
    if (accountData.type) updateData.type = accountData.type;
    if (accountData.balance !== undefined) updateData.balance = accountData.balance;
    if (accountData.icon !== undefined) updateData.icon = accountData.icon;
    if (accountData.userId !== undefined) updateData.userId = accountData.userId;
    return await prisma.accounts.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        icon: true,
        userId: true
      }
    });
  }

  static async deleteAccount(id) {
    const existingAccount = await prisma.accounts.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingAccount) {
      throw { code: 404, message: "Conta não encontrada" };
    }
    await prisma.accounts.delete({
      where: { id: parseInt(id) }
    });
    return { message: "Conta deletada com sucesso" };
  }
}

export default AccountRepository;