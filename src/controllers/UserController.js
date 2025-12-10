import UserService from '../services/UserService.js';
import CommonResponse from "../utils/commonResponse.js";

class UserController {

  static getUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.status(200).json(CommonResponse.success(user));
    } catch (err) {
      next(err);
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
      const { name, email } = req.body;
      const avatar = req.file ? req.file.path : req.body.avatar;
      const userData = { name, email, avatar };
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

  static changePassword = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const requestingUserId = req.user.id;
      const result = await UserService.changePassword(
        id, 
        { currentPassword, newPassword, confirmPassword },
        requestingUserId
      );
      
      res.status(200).json(CommonResponse.success(result));
    } catch (err) {
      next(err);
    }
  };
}

export default UserController;
