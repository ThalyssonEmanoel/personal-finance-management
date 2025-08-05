import { prisma } from "../config/prismaClient.js";

/**
 * Middleware que permite acesso apenas para administradores
 * - Bloqueia completamente a rota para usuários não administradores
 * - Apenas usuários com isAdmin = true podem prosseguir
 */
const adminOnlyMiddleware = async (req, res, next) => {
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

    // Verificar se é administrador
    if (!currentUser.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Acesso negado. Apenas administradores podem acessar esta funcionalidade" 
      });
    }

    // Se é administrador, permite continuar
    next();
  } catch (error) {
    console.error('Erro no middleware adminOnly:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Erro interno do servidor" 
    });
  }
};

export default adminOnlyMiddleware;
