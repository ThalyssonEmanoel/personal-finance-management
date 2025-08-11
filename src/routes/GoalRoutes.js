import { Router } from 'express';
import GoalController from '../controllers/GoalController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import adminOnlyMiddleware from '../middlewares/adminOnlyMiddleware.js';

const router = Router();

router.get('/goals', AuthMiddleware, GoalController.listAllGoalsUsers);
router.post('/goals', AuthMiddleware, GoalController.createGoal);
router.patch('/goals/:id', AuthMiddleware, GoalController.updateGoal);
router.delete('/goals/:id', AuthMiddleware, GoalController.deleteGoal);

router.get('/admin/goals', AuthMiddleware, adminOnlyMiddleware, GoalController.listAllGoalsAdmin);

export default router;
