import jwt from "jsonwebtoken";
import AuthSchema from "../schemas/authSchema.js";
import AuthRepository from "../repositories/AuthRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import { generateResetCode } from "../utils/generateResetCode.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

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

  static async forgotPassword(email) {
    const { email: validatedEmail } = AuthSchema.forgotPassword.parse({ email });
    
    const user = await UserRepository.findByEmail(validatedEmail);
    if (!user) throw { code: 404, message: "Email não encontrado." };
    const code = generateResetCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);// Definido para 10 minutos
    await AuthRepository.createResetCode({ email: validatedEmail, code, expiresAt });
    const subject = "Password reset code";
    const message = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Recuperação de Senha</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: rgb(232,222,146);">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgb(232,222,146); padding: 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:rgb(201,100,66); padding: 20px;">
                <h1 style="margin:0; color:#fff; font-size:26px;">Sistema de Refeições</h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 30px; color:#333;">
                <h2 style="color:rgb(201,100,66); margin-top:0;">Recuperação de Senha</h2>
                <h3 style="margin:0;">Olá, <span style="color:rgb(201,100,66);">${user.name}</span>!</h3>
                <p style="font-size:16px; line-height:1.5; margin:20px 0;">
                  Recebemos uma solicitação para redefinir a sua senha.
                </p>
                <p style="font-size:16px; line-height:1.5; margin:20px 0;">
                  Use o código abaixo para continuar com a recuperação:
                </p>
                <div style="text-align:center; margin: 30px 0;">
                  <span style="display:inline-block; background:rgb(201,100,66); color:#fff; font-size:24px; font-weight:bold; padding:15px 30px; border-radius:8px; letter-spacing:2px;">
                    ${code}
                  </span>
                </div>
                <p style="font-size:14px; color:#666;">
                  Este código expira em <strong>10 minutos</strong>.
                </p>
                <p style="font-size:14px; color:#666;">
                  Se você não solicitou essa recuperação, ignore este e-mail.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:rgb(232,222,146); padding:15px; font-size:12px; color:#555;">
                © ${new Date().getFullYear()} Sistema de Refeições — Todos os direitos reservados.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
    await sendEmail(user.email, subject, message);
    return;
  }

  static async resetPassword(email, code, password) {
    const { email: validatedEmail, code: validatedCode, password: validatedPassword } = AuthSchema.resetPassword.parse({ email, code, password });
    
    const resetCode = await AuthRepository.findValidResetCode(validatedEmail, validatedCode);

    if (!resetCode) throw { code: 400, message: "Código inválido ou expirado." };

    const hashedPassword = await bcrypt.hash(validatedPassword, parseInt(process.env.SALT));
    const user = await UserRepository.findByEmail(validatedEmail);

    if (!user) throw { code: 404, message: "Email não encontrado." };

    const updatedUser = await UserRepository.updateUserPassword(user.id, hashedPassword);

    await AuthRepository.markCodeAsUsed(resetCode.id);
    return updatedUser;
  }

}

export default AuthService;
