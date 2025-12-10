import { prisma } from "../config/prismaClient.js";
import Decimal from "decimal.js";

class GoalRepository {

  static async listGoals(filters, order = 'desc') {
    let where = { ...filters };

    const { page, limit, ...whereFilters } = where;
    where = whereFilters;

    if (filters.date) {
      const inputDate = new Date(filters.date + 'T00:00:00.000Z');
      const year = inputDate.getUTCFullYear();
      const month = inputDate.getUTCMonth();
      const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

      delete where.date;
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }

    const queryOptions = {
      where,
      orderBy: {
        createdAt: order
      }
    };

    if (page && limit) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
    }

    const result = await prisma.goals.findMany(queryOptions);

    const total = await prisma.goals.count({ where });

    return { goals: result, total };
  }

  static async createGoal(goalData) {
    const goal = await prisma.goals.create({
      data: {
        name: goalData.name,
        date: new Date(goalData.date + 'T00:00:00.000Z'),
        transaction_type: goalData.transaction_type,
        value: goalData.value,
        userId: goalData.userId
      }
    });

    return goal;
  }

  static async getGoalById(id, userId = null) {
    const where = { id };

    if (userId) {
      where.userId = userId;
    }

    const goal = await prisma.goals.findFirst({
      where
    });

    return goal;
  }

  static async updateGoal(id, userId, goalData) {
    const goal = await prisma.goals.updateMany({
      where: {
        id,
        userId
      },
      data: {
        ...goalData,
        date: goalData.date ? new Date(goalData.date + 'T00:00:00.000Z') : undefined,
        updatedAt: new Date()
      }
    });

    if (goal.count === 0) {
      return null;
    }

    return await this.getGoalById(id, userId);
  }

  static async deleteGoal(id, userId) {
    const goal = await prisma.goals.deleteMany({
      where: {
        id,
        userId
      }
    });

    return goal.count > 0;
  }

  static async getGoalsByUserAndMonth(userId, year, month) {
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const goals = await prisma.goals.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return goals;
  }

  static async calculateTransactionTotalByGoalDate(userId, goalDate, transactionType) {
    const date = new Date(goalDate);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    const transactions = await prisma.transactions.findMany({
      where: {
        userId,
        type: transactionType,
        release_date: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        value: true,
        value_installment: true
      }
    });

    const total = transactions.reduce((acc, transaction) => {
      const value = new Decimal(transaction.value_installment || transaction.value || 0);
      return acc.plus(value);
    }, new Decimal(0));

    return total.toNumber();
  }

  static async getYearsWithGoalsByUser(userId) {
    const result = await prisma.goals.findMany({
      where: {
        userId: parseInt(userId)
      },
      select: {
        date: true
      },
      distinct: ['date']
    });
    const years = [...new Set(
      result.map(goal => {
        const year = new Date(goal.date).getFullYear();
        return parseInt(year.toString().slice(-2));
      })
    )];

    return years.sort((a, b) => b - a);
  }
}

export default GoalRepository;
