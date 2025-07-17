import { prisma } from "../config/prismaClient.js";

class TransactionRepository {

  static async listTransactions(filters, skip, take, order) {
    let where = { ...filters };
    
    // Handle date filtering
    if (filters.data_pagamento) {
      where.data_pagamento = new Date(filters.data_pagamento);
    }

    const result = await prisma.transacoes.findMany({
      where,
      skip: skip,
      take: take,
      orderBy: { id: order },
      select: {
        id: true,
        tipo: true,
        nome: true,
        categoria: true,
        subcategoria: true,
        valor: true,
        data_pagamento: true,
        dia_cobranca: true,
        quantidade_parcelas: true,
        recorrente: true,
        contaId: true,
        formaPagamentoId: true,
        userId: true,
        conta: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        formaPagamento: {
          select: {
            id: true,
            nome: true
          }
        },
        usuario: {
          select: {
            id: true,
            name: true
          }
        }
      },
    });
    
    if (result.length === 0) {
      throw { code: 404, message: "No transactions found" };
    }
    return result;
  }

  static async countTransactions() {
    return await prisma.transacoes.count();
  }
}

export default TransactionRepository;