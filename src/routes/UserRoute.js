import e from "express";
import UserController from "../controllers/UserController.js";
import errorHandler from "../middlewares/errorHandler.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOrOwnerMiddleware from "../middlewares/adminOrOwnerMiddleware.js";
import adminControlMiddleware from "../middlewares/adminControlMiddleware.js";

const router = e.Router();

router
  .get("/users", authMiddleware, adminOrOwnerMiddleware, UserController.listAllUsers, errorHandler)
  .post("/users", upload.single("avatar"), UserController.registerUser, errorHandler) // para o avatar, no banco, O caminho salvo no banco será algo como: uploads/1699030930148-avatar.png
  .patch("/users/:id", authMiddleware, adminOrOwnerMiddleware, adminControlMiddleware, upload.single("avatar"), UserController.updateUser, errorHandler)
  .delete("/users/:id", authMiddleware, adminOrOwnerMiddleware, UserController.deleteUser, errorHandler)
  .patch("/users/:id/change-password", authMiddleware, UserController.changePassword, errorHandler);

export default router;
