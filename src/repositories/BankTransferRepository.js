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

  static async getBankTransferById(id, userId) {
    return await prisma.bankTransfers.findFirst({
      where: {
        id,
        userId
      },
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

  static async getAccountBalance(accountId) {
    const account = await prisma.accounts.findUnique({
      where: { id: accountId },
      select: { balance: true }
    });
    return account?.balance;
  }

  static async getBankTransferForDeletion(id) {
    return await prisma.bankTransfers.findUnique({
      where: { id },
      select: {
        id: true,
        amount: true,
        sourceAccountId: true,
        destinationAccountId: true,
        userId: true
      }
    });
  }

  static async createBankTransferWithTransaction(bankTransferData, accountUpdates) {
    return await prisma.$transaction(async (prisma) => {
      // Criar a transferência bancária
      const newBankTransfer = await prisma.bankTransfers.create({
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

      // Atualizar saldos das contas
      await Promise.all(accountUpdates.map(update => 
        prisma.accounts.update({
          where: { 
            id: update.accountId,
            userId: update.userId 
          },
          data: { balance: update.newBalance }
        })
      ));

      return newBankTransfer;
    });
  }

  static async updateBankTransferWithTransaction(id, userId, bankTransferData, accountUpdates) {
    return await prisma.$transaction(async (prisma) => {
      // Atualizar saldos das contas se necessário
      if (accountUpdates && accountUpdates.length > 0) {
        await Promise.all(accountUpdates.map(update => 
          prisma.accounts.update({
            where: { 
              id: update.accountId,
              userId: update.userId 
            },
            data: { balance: update.newBalance }
          })
        ));
      }

      // Atualizar a transferência
      return await prisma.bankTransfers.update({
        where: { id, userId },
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
    });
  }

  static async deleteBankTransferWithTransaction(id, accountUpdates) {
    return await prisma.$transaction(async (prisma) => {
      // Reverter saldos das contas
      await Promise.all(accountUpdates.map(update => 
        prisma.accounts.update({
          where: { 
            id: update.accountId,
            userId: update.userId 
          },
          data: { balance: update.newBalance }
        })
      ));

      // Deletar a transferência
      await prisma.bankTransfers.delete({
        where: { id }
      });

      return { message: "Transferência bancária excluída com sucesso e saldos das contas ajustados." };
    });
  }
}

export default BankTransferRepository;
