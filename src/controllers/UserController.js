import UserService from '../services/UserService.js';
import CommonResponse from "../utils/commonResponse.js";

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
      const { name, email, password } = req.body;
      const avatar = req.file ? req.file.path : null;
      const user = await UserService.createUser({ name, email, password, avatar });
      res.status(201).json(CommonResponse.success(user));
    } catch (err) {
      next(err);
    }
  };

  static updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;
      const avatar = req.file ? req.file.path : req.body.avatar;

      const userData = { name, email, password, avatar };
      const updatedUser = await UserService.updateUser(id, userData);
      res.status(200).json(CommonResponse.success(updatedUser));
    } catch (err) {
      next(err);
    }
  };

  static deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(id);
      res.status(200).json(CommonResponse.success(result));
    } catch (err) {
      next(err);
    }
  };
}

export default UserController;
