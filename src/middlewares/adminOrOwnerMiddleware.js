import { prisma } from "../config/prismaClient.js";

/**
 * Middleware que verifica se o usuário é administrador ou se está acessando apenas suas próprias informações
 * - Administradores podem acessar qualquer informação
 * - Usuários comuns só podem acessar suas próprias informações
 * Eu decidi colocar um atributo na tabela de usuários chamado isAdmin, porque como não pretendo ter vários tipos de usuários com diferentes permissões,
 * ações, isso simplifica o controle de acesso. Assim, apenas usuários com isAdmin = true podem acessar ou modificar informações de outros usuários.
 */
const adminOrOwnerMiddleware = async (req, res, next) => {
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

    if (currentUser.isAdmin) {
      return next();
    }

    // Se não for administrador, verificar se está tentando acessar apenas suas próprias informações
    const targetUserId = req.query.id;
    
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
    console.error('Erro no middleware adminOrOwner:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Erro interno do servidor" 
    });
  }
};

export default adminOrOwnerMiddleware;
