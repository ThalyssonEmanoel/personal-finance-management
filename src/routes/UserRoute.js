import e from "express";
import UserController from "../controllers/UserController.js";
import errorHandler from "../middlewares/errorHandler.js"; //Vem logo depois de UserController

const router = e.Router();

router
  .post("/users", UserController.registerUser, errorHandler)
  .get("/users", UserController.listAllUsers, errorHandler)
  // .get("/usuarios/:id", UserController.ListarUsuarioPorId, errorHandler)
  // .put("/usuarios/:id", UserController.AtualizarUsuario, errorHandler)
  // .delete("/usuarios/:id", UserController.DeletarUsuario, errorHandler);

export default router;
