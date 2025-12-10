import { prisma } from "../config/prismaClient.js";

class PaymentMethodsRepository {

  static async listPaymentMethods(filters, skip, take, order) {
    let where = { ...filters };
    
    const result = await prisma.paymentMethods.findMany({
      where,
      skip: skip,
      take: take,
      orderBy: { id: order },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            accountPaymentMethods: true,
            transactions: true
          }
        }
      },
    });
    
    if (result.length === 0) {
      throw { code: 404, message: "Nenhuma forma de pagamento encontrada" };
    }
    return result;
  }

  static async countPaymentMethods(filters) {
    let where = { ...filters };
    return await prisma.paymentMethods.count({ where });
  }

  static async listAccountPaymentMethods(filters, skip, take, order) {
    const { accountName, paymentMethodName, ...otherFilters } = filters;
    let where = { ...otherFilters };
    
    if (accountName) {
      where.account = {
        name: { contains: accountName }
      };
    }
    
    if (paymentMethodName) {
      where.paymentMethod = {
        name: { contains: paymentMethodName }
      };
    }
    
    const result = await prisma.accountPaymentMethods.findMany({
      where,
      skip: skip,
      take: take,
      orderBy: { id: order },
      select: {
        id: true,
        accountId: true,
        paymentMethodId: true,
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        paymentMethod: {
          select: {
            id: true,
            name: true
          }
        }
      },
    });
    
    if (result.length === 0) {
      throw { code: 404, message: "Nenhum relacionamento entre conta e método de pagamento encontrado" };
    }
    return result;
  }

  static async countAccountPaymentMethods(filters) {
    const { accountName, paymentMethodName, ...otherFilters } = filters;
    let where = { ...otherFilters };
    
    if (accountName) {
      where.account = {
        name: { contains: accountName }
      };
    }
    
    if (paymentMethodName) {
      where.paymentMethod = {
        name: { contains: paymentMethodName }
      };
    }
    
    return await prisma.accountPaymentMethods.count({ where });
  }

  static async getPaymentMethodById(id) {
    const paymentMethod = await prisma.paymentMethods.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            accountPaymentMethods: true,
            transactions: true
          }
        }
      }
    });

    if (!paymentMethod) {
      throw { code: 404, message: "Forma de pagamento não encontrada" };
    }

    return paymentMethod;
  }

  static async createPaymentMethod(data) {
    try {
      const paymentMethod = await prisma.paymentMethods.create({
        data: {
          name: data.name
        },
        select: {
          id: true,
          name: true
        }
      });

      return paymentMethod;
    } catch (error) {
      if (error.code === 'P2002') {
        throw { code: 409, message: "Já existe uma forma de pagamento com este nome" };
      }
      throw error;
    }
  }

  static async updatePaymentMethod(id, data) {
    try {
      const paymentMethod = await prisma.paymentMethods.update({
        where: { id: parseInt(id) },
        data,
        select: {
          id: true,
          name: true
        }
      });

      return paymentMethod;
    } catch (error) {
      if (error.code === 'P2025') {
        throw { code: 404, message: "Forma de pagamento não encontrada" };
      }
      if (error.code === 'P2002') {
        throw { code: 409, message: "Já existe uma forma de pagamento com este nome" };
      }
      throw error;
    }
  }

  static async deletePaymentMethod(id) {
    try {
      // Verificar se a forma de pagamento está sendo usada
      const usage = await prisma.paymentMethods.findUnique({
        where: { id: parseInt(id) },
        select: {
          _count: {
            select: {
              accountPaymentMethods: true,
              transactions: true
            }
          }
        }
      });

      if (!usage) {
        throw { code: 404, message: "Forma de pagamento não encontrada" };
      }

      if (usage._count.accountPaymentMethods > 0 || usage._count.transactions > 0) {
        throw { 
          code: 409, 
          message: "Não é possível excluir esta forma de pagamento pois está sendo utilizada por contas ou transações" 
        };
      }

      await prisma.paymentMethods.delete({
        where: { id: parseInt(id) }
      });

      return { message: "Forma de pagamento excluída com sucesso" };
    } catch (error) {
      if (error.code === 'P2025') {
        throw { code: 404, message: "Forma de pagamento não encontrada" };
      }
      throw error;
    }
  }
}

export default PaymentMethodsRepository;
