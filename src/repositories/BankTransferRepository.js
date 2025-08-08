import { prisma } from "../config/prismaClient.js";

class BankTransferRepository {
  
  static async listBankTransfers(filters, skip, take, order) {
    let where = { ...filters };

    // Converter transfer_date string para range de datas se necessário
    if (filters.transfer_date) {
      const inputDate = new Date(filters.transfer_date + 'T00:00:00.000Z');
      const year = inputDate.getUTCFullYear();
      const month = inputDate.getUTCMonth();
      const day = inputDate.getUTCDate();

      // Criar range de datas para o dia específico - usando UTC
      const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

      delete where.transfer_date;
      where.transfer_date = {
        gte: startDate,
        lte: endDate
      };
    }

    const orderBy = { transfer_date: order };
    
    return await prisma.bankTransfers.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        sourceAccount: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        destinationAccount: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        paymentMethod: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        },
      }
    });
  }

  static async countBankTransfers(filters) {
    let where = { ...filters };
    
    // Converter transfer_date string para range de datas se necessário
    if (filters && filters.transfer_date) {
      const inputDate = new Date(filters.transfer_date + 'T00:00:00.000Z');
      const year = inputDate.getUTCFullYear();
      const month = inputDate.getUTCMonth();
      const day = inputDate.getUTCDate();

      const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
      
      // Remove transfer_date do where original e substitui pelo range
      delete where.transfer_date;
      where.transfer_date = {
        gte: startDate,
        lte: endDate
      };
    }

    return await prisma.bankTransfers.count({
      where
    });
  }

  static async createBankTransfer(bankTransferData) {
    return await prisma.bankTransfers.create({
      data: bankTransferData,
      include: {
        sourceAccount: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        destinationAccount: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        paymentMethod: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  static async updateBankTransfer(id, userId, bankTransferData) {
    return await prisma.bankTransfers.update({
      where: { 
        id,
        userId 
      },
      data: bankTransferData,
      include: {
        sourceAccount: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        destinationAccount: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        paymentMethod: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  static async deleteBankTransfer(id) {
    return await prisma.bankTransfers.delete({
      where: { id }
    });
  }

  static async getCompatiblePaymentMethods(accountId) {
    return await prisma.accountPaymentMethods.findMany({
      where: { accountId },
      include: {
        paymentMethod: true
      }
    });
  }

  static async validateAccountOwnership(accountId, userId) {
    const account = await prisma.accounts.findFirst({
      where: {
        id: accountId,
        userId
      }
    });
    return account !== null;
  }

  static async getAccountBalance(accountId) {
    const account = await prisma.accounts.findUnique({
      where: { id: accountId },
      select: { balance: true }
    });
    return account?.balance;
  }
}

export default BankTransferRepository;
