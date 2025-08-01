import e from "express";
import AccountController from "../controllers/AccountController.js";
import errorHandler from "../middlewares/errorHandler.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOrOwnerMiddleware from "../middlewares/adminOrOwnerMiddleware.js";
import adminOnlyMiddleware from "../middlewares/adminOnlyMiddleware.js";

const router = e.Router();

router
.get("/account/:id", authMiddleware, adminOrOwnerMiddleware, AccountController.getAccountById, errorHandler)
.post("/account", authMiddleware, adminOrOwnerMiddleware, upload.single("Icon"), AccountController.registerAccount, errorHandler)
.patch( "/account/:id", authMiddleware, adminOrOwnerMiddleware, upload.single("Icon"), AccountController.updateAccount, errorHandler )
.delete("/account/:id", authMiddleware, adminOrOwnerMiddleware, AccountController.deleteAccount, errorHandler)

//Only admins 
.get("/admin/account", authMiddleware, adminOnlyMiddleware, AccountController.listAllAccounts, errorHandler)


export default router;