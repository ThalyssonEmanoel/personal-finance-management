import e from "express";
import UserController from "../controllers/UserController.js";
import errorHandler from "../middlewares/errorHandler.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = e.Router();

router
  .get("/users", UserController.listAllUsers, errorHandler)
  .post("/users", upload.single("Avatar"), UserController.registerUser, errorHandler) // para o avatar, no banco, O caminho salvo no banco será algo como: uploads/1699030930148-avatar.png
  .patch("/users/:id", upload.single("Avatar"), UserController.updateUser, errorHandler)
  .delete("/users/:id", UserController.deleteUser, errorHandler);

export default router;
