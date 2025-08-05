import e from "express";
import PaymentMethodsController from "../controllers/PaymentMethodsController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = e.Router();

router
  .get("/payment-methods", authMiddleware, PaymentMethodsController.listAllPaymentMethods, errorHandler)

export default router;
