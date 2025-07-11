import e from "express";
import AccountController from "../controllers/AccountController.js";
import errorHandler from "../middlewares/errorHandler.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = e.Router();

router
  .get("/account", authMiddleware, AccountController.listAllAccounts, errorHandler)
  .post( "/account", authMiddleware, upload.single("Icon"), AccountController.registerAccount, errorHandler)
  .patch( "/account/:id", authMiddleware, upload.single("Icon"), AccountController.updateAccount, errorHandler )
  .delete("/account/:id", authMiddleware, AccountController.deleteAccount, errorHandler)

export default router;