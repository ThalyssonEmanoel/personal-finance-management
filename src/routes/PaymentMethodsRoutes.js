import e from "express";
import PaymentMethodsController from "../controllers/PaymentMethodsController.js";
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = e.Router();

router
  .get("/account-payment-methods", authMiddleware, PaymentMethodsController.listAllAccountPaymentMethods, errorHandler)
  .get("/payment-methods", authMiddleware, PaymentMethodsController.listAllPaymentMethods, errorHandler)
  .get("/payment-methods/:id", authMiddleware, PaymentMethodsController.getPaymentMethodById, errorHandler)
  .post("/payment-methods", authMiddleware, PaymentMethodsController.createPaymentMethod, errorHandler)
  .patch("/payment-methods/:id", authMiddleware, PaymentMethodsController.updatePaymentMethod, errorHandler)
  .delete("/payment-methods/:id", authMiddleware, PaymentMethodsController.deletePaymentMethod, errorHandler)

export default router;
