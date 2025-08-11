import { prisma } from "../config/prismaClient.js";

class GoalRepository {

  static async listGoals(filters, skip, take, order = 'desc') {
    let where = { ...filters };

    // Filtro por mês/ano se a data for fornecida, levei em consideração o código feito lá no service de transactions
    if (filters.date) {
      const inputDate = new Date(filters.date + 'T00:00:00.000Z');
      const year = inputDate.getUTCFullYear();
      const month = inputDate.getUTCMonth();
      const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

      delete where.date;
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }

    const result = await prisma.goals.findMany({
      where,
      skip: skip,
      take: take,
      orderBy: {
        createdAt: order
      }
    });

    const total = await prisma.goals.count({ where });

    return { goals: result, total };
  }

  static async createGoal(goalData) {
    const goal = await prisma.goals.create({
      data: {
        name: goalData.name,
        date: new Date(goalData.date),
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
        date: goalData.date ? new Date(goalData.date) : undefined,
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
}

export default GoalRepository;
