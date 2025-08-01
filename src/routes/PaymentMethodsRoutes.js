import e from "express";
import PaymentMethodsController from "../controllers/PaymentMethodsController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOnlyMiddleware from "../middlewares/adminOnlyMiddleware.js";

const router = e.Router();

router
  .get("/payment-methods", authMiddleware, adminOnlyMiddleware, PaymentMethodsController.listAllPaymentMethods, errorHandler)

export default router;
