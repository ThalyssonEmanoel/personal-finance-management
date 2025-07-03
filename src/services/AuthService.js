import jwt from "jsonwebtoken";
import AuthSchema from "../schemas/authSchema.js";
import AuthRepository from "../repositories/AuthRepository.js";

class AuthService {
  static async login(data) {
    const { Email, Senha } = AuthSchema.login.parse(data);
    if (!Email || !Senha) {
      throw {
        code: 400,
        message: "Email e senha são obrigatórios.",
      }
    }
    const usuario = await AuthRepository.login(Email, Senha);

    const accessTokenExpiration = process.env.JWT_EXPIRATION_ACCESS_TOKEN || "15m";
    const refreshTokenExpiration = process.env.JWT_EXPIRATION_REFRESH_TOKEN || "7d";

    const accessToken = jwt.sign(
      {
        id: usuario.id,
        Nome: usuario.Nome,
        Email: usuario.Email,
      },
      process.env.JWT_SECRET,
      { expiresIn: accessTokenExpiration }
    );

    const refreshToken = jwt.sign(
      {
        id: usuario.id,
        Email: usuario.Email,
      },
      process.env.JWT_SECRET,
      { expiresIn: refreshTokenExpiration }
    );

    await AuthRepository.updateTokens(usuario.id, refreshToken);

    // Remove a senha do objeto usuario para não retornar na response
    const { senha, ...usuarioSemSenha } = usuario;

    return { accessToken, refreshToken, usuario: usuarioSemSenha };
  }
}

export default AuthService;
