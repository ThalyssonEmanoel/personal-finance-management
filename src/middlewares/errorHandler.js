import { ZodError } from 'zod';
import CommonResponse from '../utils/commonResponse.js';

/**
 * @errorHandler Middleware para tratamento de erros
 * No controller, embaixo dentro do catch coloque o next(error) para que o erro seja tratado aqui
 * Exemplo: catch (error) { next(error) }, para passar o erro faça throw { code: 404, message: 'Exemplo de recurso não encontrado' };
 */
function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    // Mapeia os erros do Zod para um formato mais legível
    const zodErrors = err.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message,
    }));
    
    return res.status(400).json({
      code: 400,
      message: zodErrors || err.message || "Erro de validação dos dados",
    });
  }

  if (err.code === 404) {
    return res.status(404).json(CommonResponse.notFound(err.message || "Recurso não encontrado"));
  }

  if (err.code === 409) {
    return res.status(409).json(CommonResponse.conflict(err.message || "Conflito de dados"));
  }

  const statusCode = err.code || 500;

  res.status(statusCode).json({
    error: true,
    code: statusCode,
    message: err.message || "Ocorreu um erro interno no servidor.",
  });
}

export default errorHandler;
