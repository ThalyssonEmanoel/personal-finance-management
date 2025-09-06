import { prisma } from "../config/prismaClient.js";

class AccountRepository {

  static async listAccounts(filtros, skip, take, order) {
    const { userId, ...otherFilters } = filtros;
    let where = { 
      ...otherFilters,
      active: true // Só listar contas ativas
    };
    if (userId) {
      where.userId = userId;
    }
    
    const queryOptions = {
      where,
      orderBy: { id: order },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        icon: true,
        active: true,
        userId: true,
        accountPaymentMethods: {
          select: {
            paymentMethod: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
      },
    };

    if (skip !== undefined && !isNaN(skip)) {
      queryOptions.skip = skip;
    }
    if (take !== undefined && !isNaN(take)) {
      queryOptions.take = take;
    }

    const result = await prisma.accounts.findMany(queryOptions);
    if (result.length === 0) {
      throw { code: 404, message: "Nenhuma conta encontrada" };
    }
    return result;
  }

  static async contAccounts() {
    return await prisma.accounts.count({
      where: {
        active: true // Só contar contas ativas
      }
    });
  }

  static async createAccount(accountData) {
    const { name, type, balance, icon, userId, paymentMethodIds } = accountData;

    //o normalize é usado para remover acentos e comparar nomes de forma consistente, apenas para evitar duplicatas
    const normalize = (str) => str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    const normalizedNome = normalize(name);
    const normalizedType = normalize(type);
    const existingAccounts = await prisma.accounts.findMany({
      where: {
        type,
        user: { id: userId },
        active: true // Só verificar contas ativas
      }
    });
    const similar = existingAccounts.find(acc => normalize(acc.name) === normalizedNome && normalize(acc.type) === normalizedType);
    if (similar) {
      throw { code: 409, message: "Já existe uma conta com nome semelhante e tipo para este usuário." };
    }

    // Verificar se os métodos de pagamento existem (se foram fornecidos)
    if (paymentMethodIds && paymentMethodIds.length > 0) {
      const existingPaymentMethods = await prisma.paymentMethods.findMany({
        where: {
          id: { in: paymentMethodIds }
        }
      });

      if (existingPaymentMethods.length !== paymentMethodIds.length) {
        throw { code: 400, message: "Um ou mais métodos de pagamento não foram encontrados." };
      }
    }

    const data = {
      name,
      type,
      balance,
      user: { connect: { id: userId } },
      icon: icon !== undefined ? icon : ""
    };

    // Usar transação para criar a conta e associar métodos de pagamento
    return await prisma.$transaction(async (prisma) => {
      const newAccount = await prisma.accounts.create({
        data,
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          icon: true,
          active: true,
          userId: true
        }
      });

      // Associar métodos de pagamento se foram fornecidos
      if (paymentMethodIds && paymentMethodIds.length > 0) {
        const accountPaymentMethodsData = paymentMethodIds.map(paymentMethodId => ({
          accountId: newAccount.id,
          paymentMethodId: paymentMethodId
        }));

        await prisma.accountPaymentMethods.createMany({
          data: accountPaymentMethodsData
        });
      }

      // Retornar a conta com os métodos de pagamento associados
      return await prisma.accounts.findUnique({
        where: { id: newAccount.id },
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          icon: true,
          active: true,
          userId: true,
          accountPaymentMethods: {
            select: {
              paymentMethod: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
    });
  }

  static async updateAccount(id, userId, accountData) {
    const { paymentMethodIds, ...otherData } = accountData;

    const existingAccount = await prisma.accounts.findUnique({
      where: { 
        id: parseInt(id), 
        userId: parseInt(userId),
        active: true // Só permitir edição de contas ativas
      },
    });
    if (!existingAccount) {
      throw { code: 404, message: "Conta não encontrada" };
    }
    if (otherData.name && otherData.type && userId) {
      const normalize = (str) => str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();//Talvez será melhor remover esse normalize, pois nem sempre funciona
      const normalizedNome = normalize(otherData.name);
      const normalizedType = normalize(otherData.type);
      const existingAccounts = await prisma.accounts.findMany({
        where: {
          name: otherData.name,
          type: otherData.type,
          user: { id: userId },
          active: true, // Só verificar contas ativas
          NOT: { id: parseInt(id) }
        }
      });
      const similar = existingAccounts.find(acc => normalize(acc.name) === normalizedNome && normalize(acc.type) === normalizedType);
      if (similar) {
        throw { code: 409, message: "Já existe uma conta com nome e tipo iguais para este usuário." };
      }
    }

    // Verificar se os métodos de pagamento existem (se foram fornecidos no update)
    if (paymentMethodIds && Array.isArray(paymentMethodIds) && paymentMethodIds.length > 0) {
      const existingPaymentMethods = await prisma.paymentMethods.findMany({
        where: {
          id: { in: paymentMethodIds }
        }
      });

      if (existingPaymentMethods.length !== paymentMethodIds.length) {
        throw { code: 400, message: "Um ou mais métodos de pagamento não foram encontrados." };
      }
    }

    return await prisma.$transaction(async (prisma) => {
      const updateData = {};

      if (otherData.name !== undefined && otherData.name !== null && otherData.name.trim() !== '') {
        updateData.name = otherData.name;
      }
      if (otherData.type !== undefined && otherData.type !== null && otherData.type.trim() !== '') {
        updateData.type = otherData.type;
      }
      if (otherData.balance !== undefined && otherData.balance !== null && otherData.balance !== '') {
        updateData.balance = otherData.balance;
      }
      if (otherData.icon !== undefined) {
        updateData.icon = otherData.icon;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.accounts.update({
          where: { id: parseInt(id) },
          data: updateData
        });
      }
      if (paymentMethodIds !== undefined && paymentMethodIds !== null && paymentMethodIds.length > 0) {
        await prisma.accountPaymentMethods.deleteMany({
          where: { accountId: parseInt(id) }
        });
        const accountPaymentMethodsData = paymentMethodIds.map(paymentMethodId => ({
          accountId: parseInt(id),
          paymentMethodId: paymentMethodId
        }));

        await prisma.accountPaymentMethods.createMany({
          data: accountPaymentMethodsData
        });
      }
      return await prisma.accounts.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          type: true,
          balance: true,
          icon: true,
          active: true,
          userId: true,
          accountPaymentMethods: {
            select: {
              paymentMethod: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
    });
  }

  static async deleteAccount(id, userId) {
    const existingAccount = await prisma.accounts.findUnique({
      where: { 
        id: parseInt(id), 
        userId: parseInt(userId),
        active: true 
      }
    });

    if (!existingAccount) {
      throw { code: 404, message: "Conta não encontrada ou já está inativa" };
    }

    try {
      await prisma.$transaction(async (prisma) => {
        await prisma.accountPaymentMethods.deleteMany({
          where: { accountId: parseInt(id) }
        });

        await prisma.accounts.update({
          where: { id: parseInt(id) },
          data: { active: false }
        });
      });

      return { message: "Conta desativada com sucesso. Transações e transferências foram preservadas." };
    } catch (error) {
      console.error("Erro ao desativar conta:", error);
      throw error;
    }
  }

  /**
   * Calcula o total de saldos baseado nos filtros aplicados
   */
  static async calculateTotalBalance(filters) {
    const { userId, ...otherFilters } = filters;
    let where = { 
      ...otherFilters,
      active: true // Só considerar contas ativas no cálculo
    };
    if (userId) {
      where.userId = userId;
    }

    const result = await prisma.accounts.aggregate({
      where,
      _sum: { balance: true }
    });

    return result._sum.balance || 0;
  }

  /**
   * Lista contas inativas (soft deleted)
   */
  static async listInactiveAccounts(userId, skip, take, order) {
    const queryOptions = {
      where: {
        userId,
        active: false
      },
      orderBy: { id: order },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        icon: true,
        active: true,
        userId: true,
      },
    };

    // Só adicionar skip e take se forem valores válidos
    if (skip !== undefined && !isNaN(skip)) {
      queryOptions.skip = skip;
    }
    if (take !== undefined && !isNaN(take)) {
      queryOptions.take = take;
    }

    const result = await prisma.accounts.findMany(queryOptions);
    
    return result;
  }

  /**
   * Reativa uma conta inativa
   */
  static async reactivateAccount(id, userId) {
    const existingAccount = await prisma.accounts.findUnique({
      where: { 
        id: parseInt(id), 
        userId: parseInt(userId),
        active: false // Só permitir reativar contas inativas
      }
    });

    if (!existingAccount) {
      throw { code: 404, message: "Conta inativa não encontrada" };
    }

    return await prisma.accounts.update({
      where: { id: parseInt(id) },
      data: { active: true },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        icon: true,
        active: true,
        userId: true,
      }
    });
  }
}

export default AccountRepository;