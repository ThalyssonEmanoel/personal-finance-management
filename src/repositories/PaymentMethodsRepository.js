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
}

export default PaymentMethodsRepository;
