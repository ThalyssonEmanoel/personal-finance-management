import e from "express";
import UserController from "../controllers/UserController.js";
import errorHandler from "../middlewares/errorHandler.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import userControllRoutes from "../middlewares/userControllRoutes.js";

const router = e.Router();

router
  .get("/users/:id", authMiddleware, userControllRoutes.verifyJustId, UserController.getUserById, errorHandler)
  .delete("/users/:id", authMiddleware, userControllRoutes.verifyJustId, UserController.deleteUser, errorHandler)
  .patch("/users/:id/change-password", authMiddleware, userControllRoutes.verifyJustId, UserController.changePassword, errorHandler)
  .patch("/users/:id", authMiddleware, userControllRoutes.verifyJustId, upload.single("avatar"), UserController.updateUser, errorHandler)
  .post("/users", upload.single("avatar"), UserController.registerUser, errorHandler) // para o avatar, no banco, O caminho salvo no banco será algo como: uploads/1699030930148-avatar.png

export default router;
