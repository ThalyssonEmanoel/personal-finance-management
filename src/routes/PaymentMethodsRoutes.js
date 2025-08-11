import e from "express";
import PaymentMethodsController from "../controllers/PaymentMethodsController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOnlyMiddleware from "../middlewares/adminOnlyMiddleware.js";

const router = e.Router();

router
  .get("/account-payment-methods", authMiddleware, adminOnlyMiddleware, PaymentMethodsController.listAllAccountPaymentMethods, errorHandler)
  .get("/payment-methods", authMiddleware, adminOnlyMiddleware, PaymentMethodsController.listAllPaymentMethods, errorHandler)
  .get("/payment-methods/:id", authMiddleware, adminOnlyMiddleware, PaymentMethodsController.getPaymentMethodById, errorHandler)
  .post("/payment-methods", authMiddleware, adminOnlyMiddleware, PaymentMethodsController.createPaymentMethod, errorHandler)
  .patch("/payment-methods/:id", authMiddleware, adminOnlyMiddleware, PaymentMethodsController.updatePaymentMethod, errorHandler)
  .delete("/payment-methods/:id", authMiddleware, adminOnlyMiddleware, PaymentMethodsController.deletePaymentMethod, errorHandler)

export default router;
