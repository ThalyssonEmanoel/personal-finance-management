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
  static Logout = async (req, res, next) => {
    try {
      const { id } = req.body;
      await AuthService.logout(id);

      res.status(200).json(CommonResponse.success({ message: "Logout realizado com sucesso." }));
    } catch (error) {
      next(error);
    }
  };

  static RefreshToken = async (req, res, next) => {
    try {
      const response = await AuthService.refreshToken(req.body);

      res.status(200).json(CommonResponse.success({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      }));
    } catch (error) {
      next(error);
    }
  };

  static RevokeToken = async (req, res, next) => {
    try {
      await AuthService.revokeToken(req.body);

      res.status(200).json(CommonResponse.success({ message: "Token revogado com sucesso." }));
    } catch (error) {
      next(error);
    }
  };

  static forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      res.status(200).json(CommonResponse.success());
    } catch (error) {
      next(error);
    }
  }

  static resetPassword = async (req, res, next) => {
    try {
      const { email, code, password } = req.body;
      const response = await AuthService.resetPassword(email, code, password);

      res.status(200).json(CommonResponse.success(response));
    }
    catch (error) {
      next(error);
    }
  }

  static OAuthLogin = async (req, res, next) => {
    try {
      const response = await AuthService.oauthLogin(req.body);
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
