import { prisma } from "../config/prismaClient.js";

class AccountRepository {

  static async listAccounts(filtros, skip, take, order) {
    const where = {
      ...filtros,
    };
    const result = await prisma.contas.findMany({
      where,
      skip: skip,
      take: take,
      orderBy: { id: order },
      select: {
        id: true,
        Nome: true,
        Tipo: true,
        Saldo: true,
        Icon: true,
        userId: true
      },
    });
    if (!result || result.length === 0) {
      throw { code: 404, message: "Nenhuma conta encontrada" };
    }
    return result;
  }

  static async contAccounts() {
    return await prisma.contas.count();
  }

  static async createAccount(accountData) {
    const { Nome, Tipo, Saldo, Icon, userId } = accountData;
    return await prisma.contas.create({
      data: {
        Nome,
        Tipo,
        Saldo,
        Icon: Icon || null,
        userId
      },
      select: {
        id: true,
        Nome: true,
        Tipo: true,
        Saldo: true,
        Icon: true,
        userId: true
      }
    });
  }

  static async updateAccount(id, accountData) {
    // Verificar se a conta existe
    const existingAccount = await prisma.contas.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingAccount) {
      throw { code: 404, message: "Conta não encontrada" };
    }
    // Atualizar a conta
    const updateData = {};
    if (accountData.Nome) updateData.Nome = accountData.Nome;
    if (accountData.Tipo) updateData.Tipo = accountData.Tipo;
    if (accountData.Saldo !== undefined) updateData.Saldo = accountData.Saldo;
    if (accountData.Icon !== undefined) updateData.Icon = accountData.Icon;
    if (accountData.userId !== undefined) updateData.userId = accountData.userId;
    return await prisma.contas.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        Nome: true,
        Tipo: true,
        Saldo: true,
        Icon: true,
        userId: true
      }
    });
  }

  static async deleteAccount(id) {
    // Verificar se a conta existe
    const existingAccount = await prisma.contas.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingAccount) {
      throw { code: 404, message: "Conta não encontrada" };
    }
    // Deletar a conta
    await prisma.contas.delete({
      where: { id: parseInt(id) }
    });
    return { message: "Conta deletada com sucesso" };
  }
}

export default AccountRepository;