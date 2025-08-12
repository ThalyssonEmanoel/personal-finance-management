import { Router } from 'express';
import GoalController from '../controllers/GoalController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import adminOnlyMiddleware from '../middlewares/adminOnlyMiddleware.js';
import errorHandler from "../middlewares/errorHandler.js";
import adminOrOwnerMiddleware from '../middlewares/adminOrOwnerMiddleware.js';

const router = Router();

router.get('/goals', AuthMiddleware, adminOrOwnerMiddleware.verifyWithUserId, GoalController.listAllGoalsUsers, errorHandler);
router.post('/goals', AuthMiddleware, adminOrOwnerMiddleware.verifyWithUserId, GoalController.createGoal, errorHandler);
router.patch('/goals/:id', AuthMiddleware, adminOrOwnerMiddleware.verifyWithUserId, GoalController.updateGoal, errorHandler);
router.delete('/goals/:id', AuthMiddleware, adminOrOwnerMiddleware.verifyWithUserId, GoalController.deleteGoal, errorHandler);

router.get('/admin/goals', AuthMiddleware, adminOnlyMiddleware, GoalController.listAllGoalsAdmin, errorHandler);

export default router;
