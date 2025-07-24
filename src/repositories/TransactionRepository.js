import { prisma } from "../config/prismaClient.js";

class TransactionRepository {

  static async listTransactions(filters, skip, take, order) {
    let where = { ...filters };
    
    // Esse if serve para filtrar da seguinte maneira, busca todas as transações apartir do dia informado até o final do mês escolhido
    if (filters.data_pagamento) {
      const inputDate = new Date(filters.data_pagamento + 'T00:00:00.000Z'); // Force UTC
      const year = inputDate.getUTCFullYear();
      const month = inputDate.getUTCMonth(); // conta a partir de 0, então janeiro é 0, fevereiro é 1, etc.
      const day = inputDate.getUTCDate();
      
      // Aqui é criado um range de datas para o filtro - usando UTC
      const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)); // Last day of the month
      
      // Debug logs
      console.log('Input date:', filters.data_pagamento);
      console.log('Parsed date:', inputDate);
      console.log('Year:', year, 'Month:', month, 'Day:', day);
      console.log('Start date:', startDate);
      console.log('End date:', endDate);
      
      // Remove data_pagamento do where original e substitui pelo range
      delete where.data_pagamento;
      where.data_pagamento = {
        gte: startDate, 
        lte: endDate    
      };
      
      console.log('Final where condition:', JSON.stringify(where, null, 2));
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
        parcela_atual: true,
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

  /**
   * https://blog.dbins.com.br/resolvendo-problemas-comuns-com-datas-no-javascript
   * Serviu para resolver o problema de datas no JavaScript, onde o mês começa do 0 e não do 1.
   */
  static async countTransactions(filters) {
    let where = { ...filters };
    
    // Aplicar o mesmo filtro de data usado no listTransactions
    if (filters && filters.data_pagamento) {
      const inputDate = new Date(filters.data_pagamento + 'T00:00:00.000Z'); // Force UTC
      const year = inputDate.getUTCFullYear();
      const month = inputDate.getUTCMonth();
      const day = inputDate.getUTCDate();
      
      const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
      
      // Remove data_pagamento do where original e substitui pelo range
      delete where.data_pagamento;
      where.data_pagamento = {
        gte: startDate, 
        lte: endDate    
      };
    }
    
    return await prisma.transacoes.count({ where });
  }
}

export default TransactionRepository;