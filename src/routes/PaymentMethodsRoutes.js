import e from "express";
import PaymentMethodsController from "../controllers/PaymentMethodsController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOnlyMiddleware from "../middlewares/adminOnlyMiddleware.js";

const router = e.Router();

router
  .get("/account-payment-methods", authMiddleware, adminOnlyMiddleware, PaymentMethodsController.listAllAccountPaymentMethods, errorHandler)
  .get("/payment-methods", authMiddleware, PaymentMethodsController.listAllPaymentMethods, errorHandler)

export default router;
