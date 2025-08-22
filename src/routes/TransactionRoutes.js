import e from "express";
import TransactionController from "../controllers/TransactionController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOrOwnerMiddleware from "../middlewares/adminOrOwnerMiddleware.js";
import adminOnlyMiddleware from "../middlewares/adminOnlyMiddleware.js";

const router = e.Router();

router
  .get("/transactions", authMiddleware, adminOrOwnerMiddleware.verifyWithUserId, TransactionController.listAllTransactionsUsers, errorHandler)
  .post("/transactions", authMiddleware, adminOrOwnerMiddleware.verifyWithUserId, TransactionController.createTransaction, errorHandler)
  .patch("/transactions/:id", authMiddleware, adminOrOwnerMiddleware.verifyWithUserId, TransactionController.updateTransaction, errorHandler)
  .delete("/transactions/:id", authMiddleware, adminOrOwnerMiddleware.verifyWithUserId, TransactionController.deleteTransaction, errorHandler)
  .get("/transactions/download", authMiddleware, adminOrOwnerMiddleware.verifyWithUserId, TransactionController.downloadStatementPDF, errorHandler)
  //Admin
  .get("/transactions/admin", authMiddleware, adminOnlyMiddleware, TransactionController.listAllTransactionsAdmin, errorHandler)
export default router;