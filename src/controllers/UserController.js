import env from "dotenv";
import UserService from '../services/UserService.js';
import CommonResponse from "../utils/commonResponse.js";

env.config();

class UserController {

  static listAllUsers = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, ...filtros } = req.query;
      const { usuarios, total } = await UserService.listUsers(filtros, page, limit, 'desc');
      res.status(200).json(CommonResponse.success(usuarios, total));
    } catch (err) {
      next(err)
    }
  };
}

export default UserController;
