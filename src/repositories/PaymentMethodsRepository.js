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
}

export default PaymentMethodsRepository;
