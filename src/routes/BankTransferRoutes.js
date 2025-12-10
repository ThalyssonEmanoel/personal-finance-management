import e from "express";
import BankTransferController from "../controllers/BankTransferController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import userControllRoutes from "../middlewares/userControllRoutes.js";

const router = e.Router();

router
  .get("/BankTransfer", authMiddleware, userControllRoutes.verifyWithUserId, BankTransferController.listAllBankTransferUsers, errorHandler)
  .post("/BankTransfer", authMiddleware, userControllRoutes.verifyWithUserId, BankTransferController.createTransfer, errorHandler)
  .patch("/BankTransfer/:id", authMiddleware, userControllRoutes.verifyWithUserId, BankTransferController.updateTransfer, errorHandler)
  .delete("/BankTransfer/:id", authMiddleware, userControllRoutes.verifyWithUserId, BankTransferController.deleteTransfer, errorHandler)
export default router;