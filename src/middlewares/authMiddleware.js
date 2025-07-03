import jwt from "jsonwebtoken";
import CommonResponse from "../utils/commonResponse.js";

const AuthMiddleware = (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header) {
      return res.status(401).json(CommonResponse.unauthorized("Token não fornecido no cabeçalho de autorização"));
    }

    const bearer = header.split(" ");
    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
      return res.status(401).json(CommonResponse.unauthorized("Formato do token inválido. Use 'Bearer <token>'"));
    }

    const token = bearer[1];
    if (!token) {
      return res.status(401).json(CommonResponse.unauthorized("Token ausente"));
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    const payload = jwt.verify(token, JWT_SECRET);

    if (!payload) {
      return res.status(401).json(CommonResponse.unauthorized("Token inválido ou expirado"));
    }

    req.user = payload;
    return next();
  } catch (error) {
    console.error("Erro no middleware AuthMiddleware:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json(CommonResponse.unauthorized(`Token JWT malformado ou inválido: ${error.message}`));
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(CommonResponse.unauthorized(`Token expirado: ${error.message}`));
    }
    return res.status(500).json(CommonResponse.serverError("Erro interno do servidor"));
  }
};

export default AuthMiddleware;