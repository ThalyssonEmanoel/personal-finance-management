import { prisma } from "../config/prismaClient.js";

class BalanceHistoryRepository {

  static async findByAccountAndDateRange(accountId, startDate, endDate, skip, take, order = 'desc') {
    const where = {
      accountId: parseInt(accountId)
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else if (startDate) {
      where.date = {
        gte: new Date(startDate)
      };
    } else if (endDate) {
      where.date = {
        lte: new Date(endDate)
      };
    }

    const queryOptions = {
      where,
      orderBy: { date: order },
      select: {
        id: true,
        date: true,
        balance: true,
        createdAt: true,
        accountId: true,
        account: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    };

    if (skip !== undefined && !isNaN(skip)) {
      queryOptions.skip = skip;
    }
    if (take !== undefined && !isNaN(take)) {
      queryOptions.take = take;
    }

    const result = await prisma.balanceHistory.findMany(queryOptions);
    
    if (result.length === 0) {
      throw { code: 404, message: "Nenhum histórico de saldo encontrado" };
    }
    
    return result;
  }

  static async countByAccountAndDateRange(accountId, startDate, endDate) {
    const where = {
      accountId: parseInt(accountId)
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else if (startDate) {
      where.date = {
        gte: new Date(startDate)
      };
    } else if (endDate) {
      where.date = {
        lte: new Date(endDate)
      };
    }

    return await prisma.balanceHistory.count({ where });
  }

  static async createBalanceRecord(accountId, date, balance) {
    const balanceDate = new Date(date);
    balanceDate.setUTCHours(0, 0, 0, 0); 

    return await prisma.balanceHistory.upsert({
      where: {
        accountId_date: {
          accountId: parseInt(accountId),
          date: balanceDate
        }
      },
      update: {
        balance: balance
      },
      create: {
        accountId: parseInt(accountId),
        date: balanceDate,
        balance: balance
      },
      select: {
        id: true,
        date: true,
        balance: true,
        createdAt: true,
        accountId: true
      }
    });
  }

  static async findExistingRecord(accountId, date) {
    const balanceDate = new Date(date);
    balanceDate.setUTCHours(0, 0, 0, 0);

    return await prisma.balanceHistory.findUnique({
      where: {
        accountId_date: {
          accountId: parseInt(accountId),
          date: balanceDate
        }
      }
    });
  }

  static async deleteByAccountAndDateRange(accountId, startDate, endDate) {
    const where = {
      accountId: parseInt(accountId)
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else if (startDate) {
      where.date = {
        gte: new Date(startDate)
      };
    } else if (endDate) {
      where.date = {
        lte: new Date(endDate)
      };
    }

    return await prisma.balanceHistory.deleteMany({ where });
  }

  static async getAllAccountsWithCurrentBalance() {
    return await prisma.accounts.findMany({
      select: {
        id: true,
        name: true,
        balance: true,
        userId: true
      }
    });
  }

  static async bulkCreateBalanceRecords(records) {
    const balanceRecords = records.map(record => ({
      accountId: parseInt(record.accountId),
      date: new Date(record.date),
      balance: record.balance
    }));

    return await prisma.balanceHistory.createMany({
      data: balanceRecords,
      skipDuplicates: true
    });
  }
}

export default BalanceHistoryRepository;