import { prisma } from "../config/prismaClient.js";

class BankTransferRepository {
  
  static async listBankTransfers(filters, skip, take, order) {
    const orderBy = { transfer_date: order };
    
    return await prisma.bankTransfers.findMany({
      where: filters,
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
        }
      }
    });
  }

  static async countBankTransfers(filters) {
    return await prisma.bankTransfers.count({
      where: filters
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
