import e from "express";
import BalanceHistoryController from "../controllers/BalanceHistoryController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import userControllRoutes from "../middlewares/userControllRoutes.js";

const router = e.Router();

router
  .get("/balance-history/:accountId", authMiddleware, userControllRoutes.verifyAccountAccess, BalanceHistoryController.getBalanceHistory, errorHandler)
  .post("/balance-history/record", authMiddleware, BalanceHistoryController.recordDailyBalance, errorHandler)
  .post("/balance-history/recalculate", authMiddleware, userControllRoutes.verifyWithUserId, BalanceHistoryController.recalculateBalanceHistory, errorHandler);

export default router;