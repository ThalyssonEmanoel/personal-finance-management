import e from "express";
import AccountPaymentMethodsController from "../controllers/AccountPaymentMethodsController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOnlyMiddleware from "../middlewares/adminOnlyMiddleware.js";

const router = e.Router();

router
  .get("/account-payment-methods", authMiddleware, adminOnlyMiddleware, AccountPaymentMethodsController.listAllAccountPaymentMethods, errorHandler)

export default router;
