import e from "express";
import BankTransferController from "../controllers/BankTransferController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOrOwnerMiddleware from "../middlewares/adminOrOwnerMiddleware.js";
import adminOnlyMiddleware from "../middlewares/adminOnlyMiddleware.js";

const router = e.Router();

router
  .get("/BankTransfer", authMiddleware, adminOrOwnerMiddleware.verifyWithUserId, BankTransferController.listAllBankTransferUsers, errorHandler)
  .post("/BankTransfer", authMiddleware, adminOrOwnerMiddleware.verifyWithUserId, BankTransferController.createTransfer, errorHandler)
  .patch("/BankTransfer/:id", authMiddleware, adminOrOwnerMiddleware.verifyWithUserId, BankTransferController.updateTransfer, errorHandler)
  .delete("/BankTransfer/:id", authMiddleware, adminOrOwnerMiddleware.verifyWithUserId, BankTransferController.deleteTransfer, errorHandler)
  //Admin
  .get("/BankTransfer/admin", authMiddleware, adminOnlyMiddleware, BankTransferController.listAllBankTransferAdmin, errorHandler)
export default router;