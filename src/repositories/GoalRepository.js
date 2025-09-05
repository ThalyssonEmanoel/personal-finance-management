import { prisma } from "../config/prismaClient.js";

class GoalRepository {

  static async listGoals(filters, order = 'desc') {
    let where = { ...filters };

    // Filtro anual a partir do mês especificado na data
    if (filters.date) {
      const inputDate = new Date(filters.date + 'T00:00:00.000Z');
      const year = inputDate.getUTCFullYear();
      const month = inputDate.getUTCMonth();
      
      // Data de início: primeiro dia do mês especificado
      const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      
      // Data de fim: último dia de dezembro do mesmo ano
      const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

      delete where.date;
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }

    const result = await prisma.goals.findMany({
      where,
      orderBy: {
        createdAt: order
      }
    });

    const total = result.length;

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
}

export default GoalRepository;
