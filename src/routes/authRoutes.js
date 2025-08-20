import e from "express";
import AuthController from '../controllers/AuthController.js';
import errorHandler from "../middlewares/errorHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOnlyMiddleware from "../middlewares/adminOnlyMiddleware.js";

const router = e.Router();

router
  .post("/login", AuthController.Login, errorHandler)
  .post("/logout", authMiddleware, AuthController.Logout, errorHandler)
  .post("/refresh-token", AuthController.RefreshToken, errorHandler)
  .post("/revoke-token", authMiddleware,adminOnlyMiddleware , AuthController.RevokeToken, errorHandler)
  .post("/forgot-password", AuthController.forgotPassword, errorHandler)
  .post("/reset-password", AuthController.resetPassword, errorHandler)

export default router;
