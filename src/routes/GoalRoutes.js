import { Router } from 'express';
import GoalController from '../controllers/GoalController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import errorHandler from "../middlewares/errorHandler.js";
import userControllRoutes from '../middlewares/userControllRoutes.js';

const router = Router();

router.get('/goals', AuthMiddleware, userControllRoutes.verifyWithUserId, GoalController.listAllGoalsUsers, errorHandler);
router.post('/goals', AuthMiddleware, userControllRoutes.verifyWithUserId, GoalController.createGoal, errorHandler);
router.patch('/goals/:id', AuthMiddleware, userControllRoutes.verifyWithUserId, GoalController.updateGoal, errorHandler);
router.delete('/goals/:id', AuthMiddleware, userControllRoutes.verifyWithUserId, GoalController.deleteGoal, errorHandler);

export default router;
