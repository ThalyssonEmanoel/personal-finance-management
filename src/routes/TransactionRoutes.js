import e from "express";
import TransactionController from "../controllers/TransactionController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import userControllRoutes from "../middlewares/userControllRoutes.js";

const router = e.Router();

router
  .get("/transactions", authMiddleware, userControllRoutes.verifyWithUserId, TransactionController.listAllTransactionsUsers, errorHandler)
  .post("/transactions", authMiddleware, userControllRoutes.verifyWithUserId, TransactionController.createTransaction, errorHandler)
  .patch("/transactions/:id", authMiddleware, userControllRoutes.verifyWithUserId, TransactionController.updateTransaction, errorHandler)
  .delete("/transactions/:id", authMiddleware, userControllRoutes.verifyWithUserId, TransactionController.deleteTransaction, errorHandler)
  .get("/transactions/download", authMiddleware, userControllRoutes.verifyWithUserId, TransactionController.downloadStatementPDF, errorHandler)
export default router;