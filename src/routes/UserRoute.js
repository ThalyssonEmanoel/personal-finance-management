import e from "express";
import UserController from "../controllers/UserController.js";
import errorHandler from "../middlewares/errorHandler.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = e.Router();

router
  .get("/users", authMiddleware, UserController.listAllUsers, errorHandler)
  .post("/users", authMiddleware, upload.single("Avatar"), UserController.registerUser, errorHandler) // para o avatar, no banco, O caminho salvo no banco será algo como: uploads/1699030930148-avatar.png
  .patch("/users/:id", authMiddleware, upload.single("Avatar"), UserController.updateUser, errorHandler)
  .delete("/users/:id", authMiddleware, UserController.deleteUser, errorHandler);

export default router;
