import GoalService from '../services/GoalService.js';
import CommonResponse from "../utils/commonResponse.js";
import GoalSchemas from '../schemas/GoalSchemas.js';

class GoalController {

  static listAllGoalsUsers = async (req, res, next) => {
    try {
      const query = req.query;
      const validQuery = GoalSchemas.listGoals.parse(query);
      const page = validQuery.page ? Number(validQuery.page) : 1;
      const { goals, total, take } = await GoalService.listGoals(validQuery, 'desc');
      res.status(200).json(CommonResponse.success(goals, total, page, take));
    } catch (err) {
      next(err);
    }
  };

  static createGoal = async (req, res, next) => {
    try {
      const bodyData = GoalSchemas.createGoal.parse(req.body);
      const queryData = GoalSchemas.createGoalQuery.parse(req.query);

      const { name, date, transaction_type, value } = bodyData;
      const { userId } = queryData;
      
      const goal = await GoalService.createGoal({ 
        name, 
        date, 
        transaction_type, 
        value, 
        userId 
      });
      
      res.status(201).json(CommonResponse.success(goal));
    } catch (err) {
      next(err);
    }
  };

  static updateGoal = async (req, res, next) => {
    try {
      const { id } = req.query;
      const { userId } = req.query;
      const goalData = GoalSchemas.updateGoal.parse(req.body);

      const updatedGoal = await GoalService.updateGoal(parseInt(id), parseInt(userId), goalData);
      res.status(200).json(CommonResponse.success(updatedGoal));
    } catch (err) {
      next(err);
    }
  };

  static deleteGoal = async (req, res, next) => {
    try {
      const { id } = GoalSchemas.goalIdParam.parse(req.query);
      const { userId } = GoalSchemas.goalUserIdParam.parse(req.query);
      
      const result = await GoalService.deleteGoal(id, userId);
      res.status(200).json(CommonResponse.success(result));
    } catch (err) {
      next(err);
    }
  };
}

export default GoalController;
