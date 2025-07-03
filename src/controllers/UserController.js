import env from "dotenv";
import UserService from '../services/UserService.js';
import CommonResponse from "../utils/commonResponse.js";

env.config();

class UserController {

  static listAllUsers = async (req, res, next) => {
    try {
      const { page, limit = 10, ...filtros } = req.query;
      const { usuarios, total, take } = await UserService.listUsers(filtros, page || 1, limit, 'desc');
      res.status(200).json(CommonResponse.success(usuarios, total, page || 1, take));
    } catch (err) {
      next(err)
    }
  };
  static registerUser = async (req, res, next) => {
    try {
      const { Nome, Email, Senha } = req.body;
      const Avatar = req.file ? req.file.path : null;
      const user = await UserService.createUser({ Nome, Email, Senha, Avatar });
      res.status(201).json(CommonResponse.success(user));
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
