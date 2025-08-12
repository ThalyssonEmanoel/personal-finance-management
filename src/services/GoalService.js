import GoalRepository from '../repositories/GoalRepository.js';
import GoalSchemas from '../schemas/GoalSchemas.js';

class GoalService {

  static async listGoals(filters, order = 'desc') {
    const validFilters = GoalSchemas.listGoals.parse(filters);
    const { page, limit, ...otherFilters } = validFilters;

    const skip = (page - 1) * limit;
    const { goals, total } = await GoalRepository.listGoals(otherFilters, skip, limit, order);

    return { goals, total, take: limit };
  }

  static async createGoal(goalData) {
    const validGoal = GoalSchemas.createGoal.parse(goalData);

    // Verificar se já existe uma meta para o mesmo tipo de transação no mesmo mês
    const goalDate = new Date(validGoal.date);
    const year = goalDate.getFullYear();
    const month = goalDate.getMonth() + 1;

    const existingGoals = await GoalRepository.getGoalsByUserAndMonth(
      goalData.userId,
      year,
      month
    );

    // Serve para verificar se já existe uma meta para o mesmo tipo de transação no mesmo mês
    const conflictingGoal = existingGoals.find(goal =>
      goal.transaction_type === validGoal.transaction_type
    );

    if (conflictingGoal) {
      throw { code: 409, message: `Já existe uma meta de ${validGoal.transaction_type === 'income' ? 'receita' : 'despesa'} para este mês.` };
    }

    const goal = await GoalRepository.createGoal({
      ...validGoal,
      userId: goalData.userId
    });

    return goal;
  }

  static async updateGoal(id, userId, goalData) {
    
    const ValidId = GoalSchemas.goalIdParam.parse({ id });
    const ValidUserId = GoalSchemas.goalUserIdParam.parse({ userId });
    const existingGoal = await GoalRepository.getGoalById(ValidId.id, ValidUserId.userId);
    if (!existingGoal) {
      throw { code: 404, message: 'Meta não encontrada.' };
    }

    const validGoalData = GoalSchemas.updateGoal.parse(goalData);

    // Filtrar campos vazios/nulos para não serem processados
    const filteredData = {};
    Object.keys(validGoalData).forEach(key => {
      const value = validGoalData[key];
      if (value !== undefined && value !== null && value !== "") {
        filteredData[key] = value;
      }
    });

    // Se estiver tentando alterar a data ou tipo de transação, verificar conflitos
    if (filteredData.date || filteredData.transaction_type) {
      const newDate = filteredData.date ? new Date(filteredData.date) : new Date(existingGoal.date);
      const newType = filteredData.transaction_type || existingGoal.transaction_type;

      const year = newDate.getFullYear();
      const month = newDate.getMonth() + 1;

      const existingGoals = await GoalRepository.getGoalsByUserAndMonth(ValidUserId.userId, year, month);

      const conflictingGoal = existingGoals.find(goal =>
        goal.transaction_type === newType && goal.id !== ValidId.id
      );

      if (conflictingGoal) {
        throw { code: 409, message: `Já existe uma meta de ${newType === 'income' ? 'receita' : 'despesa'} para este mês.` };
      }
    }

    const updatedGoal = await GoalRepository.updateGoal(ValidId.id, ValidUserId.userId, filteredData);

    if (!updatedGoal) {
      throw { code: 400, message: 'Falha ao atualizar a meta.' };
    }

    return updatedGoal;
  }

  static async deleteGoal(id, userId) {
    // Verificar se a meta existe e pertence ao usuário
    const existingGoal = await GoalRepository.getGoalById(id, userId);
    if (!existingGoal) {
      throw { code: 404, message: 'Meta não encontrada.' };
    }

    const deleted = await GoalRepository.deleteGoal(id, userId);

    if (!deleted) {
      throw { code: 400, message: 'Falha ao deletar a meta.' };
    }

    return { message: 'Meta deletada com sucesso.' };
  }
}

export default GoalService;
