import { prisma } from "../config/prismaClient.js";

/**
 * - Usuários comuns só podem acessar suas próprias informações
 */
class userControllRoutes {
  /**
   * Essa função é para caso o ID do usuário seja o atributo principal, ficando apenas como "id" e não "userId".        
   */
  static verifyJustId = async (req, res, next) => {
    try {
      const currentUserId = req.user?.id;

      if (!currentUserId) {
        return res.status(401).json({
          success: false,
          message: "Token de autenticação inválido"
        });
      }

      // Buscar informações do usuário atual
      const currentUser = await prisma.users.findUnique({
        where: { id: currentUserId },
        select: { id: true }
      });

      if (!currentUser) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado"
        });
      }

      const targetUserId = req.params.id || req.query.id || req.params.userId;

      // Para rotas que não têm ID específico (como GET /users), filtrar apenas o próprio usuário
      if (!targetUserId) {
        // Adicionar filtro para retornar apenas o próprio usuário
        req.query.id = currentUserId.toString();
        return next();
      }

      // Para rotas com ID específico, verificar se é o próprio usuário
      if (parseInt(targetUserId) !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: "Acesso negado. Você só pode acessar suas próprias informações"
        });
      }

      next();
    } catch (error) {
      console.error('Erro no middleware verifyJustId:', error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
      });
    }
  };

  /**
   * Utilizado principalmente para as rotas cujo o id do usuário não é o id principal da rota, mas que é necessário para filtrar as contas, despesas, receitas específicas de um usuário.
   * POST /account?userId=1
   */
  static verifyWithUserId = async (req, res, next) => {
    try {
      const currentUserId = req.user?.id;

      if (!currentUserId) {
        return res.status(401).json({
          success: false,
          message: "Token de autenticação inválido"
        });
      }

      // Buscar informações do usuário atual
      const currentUser = await prisma.users.findUnique({
        where: { id: currentUserId },
        select: { id: true }
      });

      if (!currentUser) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado"
        });
      }

      const targetUserId = req.query.userId;

      // Para rotas que não têm userId fornecido, exigir que seja fornecido
      if (!targetUserId) {
        return res.status(400).json({
          success: false,
          message: "O parâmetro userId é obrigatório"
        });
      }

      if (parseInt(targetUserId) !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: "Acesso negado. Você só pode acessar suas próprias informações"
        });
      }

      next();
    } catch (error) {
      console.error('Erro no middleware userControllRoutes:', error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
      });
    }
  };
}
export default userControllRoutes;
