import e from "express";
import UserController from "../controllers/UserController.js";
import errorHandler from "../middlewares/errorHandler.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOrOwnerMiddleware from "../middlewares/adminOrOwnerMiddleware.js";
import adminOnlyMiddleware from "../middlewares/adminOnlyMiddleware.js";

const router = e.Router();

router
  .get("/users/:id", authMiddleware, adminOrOwnerMiddleware.verifyJustId, UserController.getUserById, errorHandler)
  .delete("/users/:id", authMiddleware, adminOrOwnerMiddleware.verifyJustId, UserController.deleteUser, errorHandler)
  .patch("/users/:id/change-password", authMiddleware, adminOrOwnerMiddleware.verifyJustId, UserController.changePassword, errorHandler)
  .patch("/users/:id", authMiddleware, adminOrOwnerMiddleware.verifyJustId, upload.single("avatar"), UserController.updateUser, errorHandler)
  .post("/users", upload.single("avatar"), UserController.registerUser, errorHandler) // para o avatar, no banco, O caminho salvo no banco será algo como: uploads/1699030930148-avatar.png

  //apenas adminstradores podem ter acesso:
  .get("/admin/users", authMiddleware, adminOnlyMiddleware, UserController.listAllUsers, errorHandler)
  .post("/admin/users", authMiddleware, upload.single("avatar"), adminOnlyMiddleware, UserController.registerUserAdmin, errorHandler) // para o avatar, no banco, O caminho salvo no banco será algo como: uploads/1699030930148-avatar.png
  .patch("/admin/users/:id", authMiddleware, adminOnlyMiddleware, upload.single("avatar"), UserController.updateUserAdmin, errorHandler)

export default router;
