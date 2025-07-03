import AuthService from "../services/AuthService.js";
import CommonResponse from "../utils/commonResponse.js";

class AuthController {
  static Login = async (req, res, next) => {
    try {
      const response = await AuthService.login(req.body);
      res.status(200).json(CommonResponse.success({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        usuario: response.usuario
      }));
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
