import jwt from "jsonwebtoken";
import AuthSchema from "../schemas/authSchema.js";
import AuthRepository from "../repositories/AuthRepository.js";

class AuthService {
  static async login(data) {
    const { email, password } = AuthSchema.login.parse(data);
    
    if (!email || !password) {
      throw {
        code: 400,
        message: "Email e senha são obrigatórios.",
      }
    }
    const usuario = await AuthRepository.login(email, password);

    const accessTokenExpiration = process.env.JWT_EXPIRATION_ACCESS_TOKEN || "15m";
    const refreshTokenExpiration = process.env.JWT_EXPIRATION_REFRESH_TOKEN || "7d";

    const accessToken = jwt.sign(
      {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: accessTokenExpiration }
    );

    const refreshToken = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: refreshTokenExpiration }
    );

    await AuthRepository.updateTokens(usuario.id, refreshToken);

    // Remove a senha do objeto usuario para não retornar na response
    const { senha, ...usuarioSemSenha } = usuario;

    return { accessToken, refreshToken, usuario: usuarioSemSenha };
  };
  static async logout(id) {
    if (!id) {
      throw { code: 400, message: "ID do usuário é obrigatório." };
    }
    const usuario = AuthSchema.logout.parse({ id });
    await AuthRepository.removeTokens(usuario.id);
  }

  static async refreshToken(refreshTokenData) {
    const { refreshToken } = AuthSchema.refreshToken.parse(refreshTokenData);

    try {
      // Verificar se o token é válido
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      
      // Verificar se o usuário ainda existe e tem o mesmo refresh token
      const usuario = await AuthRepository.validateRefreshToken(decoded.id, refreshToken);

      const accessTokenExpiration = process.env.JWT_EXPIRATION_ACCESS_TOKEN || "15m";

      // Gerar apenas novo access token
      const newAccessToken = jwt.sign(
        {
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: accessTokenExpiration }
      );

      // Retorna o novo access token e mantém o mesmo refresh token
      return { accessToken: newAccessToken, refreshToken: refreshToken };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw { code: 401, message: "Refresh token inválido ou expirado." };
      }
      throw error;
    }
  }

  static async revokeToken(userData) {
    const { userId } = AuthSchema.revokeToken.parse(userData);
    
    await AuthRepository.removeTokens(userId);
  }
}

export default AuthService;
