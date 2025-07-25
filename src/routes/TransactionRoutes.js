import e from "express";
import TransactionController from "../controllers/TransactionController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = e.Router();

router
  .get("/transactions", TransactionController.listAllTransactions, errorHandler)
  .post("/transactions", authMiddleware, TransactionController.createTransaction, errorHandler)
  .patch("/transactions/:id", authMiddleware, TransactionController.updateTransaction, errorHandler)
  .delete("/transactions/:id", authMiddleware, TransactionController.deleteTransaction, errorHandler)
  .get("/accounts/:accountId/payment-methods", authMiddleware, TransactionController.getCompatiblePaymentMethods, errorHandler)

export default router;