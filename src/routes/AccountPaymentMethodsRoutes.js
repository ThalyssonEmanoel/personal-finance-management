import e from "express";
import AccountPaymentMethodsController from "../controllers/AccountPaymentMethodsController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = e.Router();

router
  .get("/account-payment-methods", authMiddleware, AccountPaymentMethodsController.listAllAccountPaymentMethods, errorHandler)

export default router;
