import { prisma } from "../config/prismaClient.js";

/**
 * Middleware que controla a criação e atualização de usuários administradores
 * - Apenas administradores podem definir ou alterar o campo isAdmin
 * - Usuários comuns não podem se tornar administradores
 */
const adminControlMiddleware = async (req, res, next) => {
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
      select: { id: true, isAdmin: true }
    });

    if (!currentUser) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuário não encontrado" 
      });
    }

    // Se for administrador, pode fazer qualquer alteração
    if (currentUser.isAdmin) {
      return next();
    }

    // Se não for administrador e está tentando definir isAdmin
    if (req.body && req.body.hasOwnProperty('isAdmin')) {
      // Se está tentando se tornar admin ou definir outro usuário como admin
      if (req.body.isAdmin === true || req.body.isAdmin === 'true') {
        return res.status(403).json({ 
          success: false, 
          message: "Apenas administradores podem conceder privilégios administrativos" 
        });
      }
      
      // Remove o campo isAdmin da requisição para usuários não-admin
      delete req.body.isAdmin;
    }

    next();
  } catch (error) {
    console.error('Erro no middleware adminControl:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Erro interno do servidor" 
    });
  }
};

export default adminControlMiddleware;
