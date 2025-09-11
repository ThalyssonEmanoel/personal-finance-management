import e from "express";
import AccountController from "../controllers/AccountController.js";
import errorHandler from "../middlewares/errorHandler.js";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import userControllRoutes from "../middlewares/userControllRoutes.js";
const router = e.Router();

router
.get("/account/:id", authMiddleware, userControllRoutes.verifyWithUserId, AccountController.listAllAccountsUser, errorHandler)
.post("/account", authMiddleware, userControllRoutes.verifyWithUserId, upload.single("icon"), AccountController.registerAccount, errorHandler)
.patch( "/account/:id", authMiddleware, userControllRoutes.verifyWithUserId, upload.single("icon"), AccountController.updateAccount, errorHandler )
.delete("/account/:id", authMiddleware, userControllRoutes.verifyWithUserId, AccountController.deleteAccount, errorHandler)



export default router;