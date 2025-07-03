import e from "express";
import UserController from "../controllers/UserController.js";
import errorHandler from "../middlewares/errorHandler.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = e.Router();

router
  .get("/users", UserController.listAllUsers, errorHandler)
  .post("/users", upload.single("Avatar"), UserController.registerUser, errorHandler)// para o avatatr, no banco, O caminho salvo no banco será algo como: uploads/1699030930148-avatar.png
// .get("/usuarios/:id", UserController.ListarUsuarioPorId, errorHandler)
// .put("/usuarios/:id", UserController.AtualizarUsuario, errorHandler)
// .delete("/usuarios/:id", UserController.DeletarUsuario, errorHandler);

export default router;
