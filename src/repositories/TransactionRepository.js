import { prisma } from "../config/prismaClient.js";
import Decimal from "decimal.js";

class TransactionRepository {
  static async listTransactionsForPDF(userId, startDate, endDate, type, accountId) {
    let where = {
      userId: parseInt(userId),
      release_date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    };

    if (type && (type === 'income' || type === 'expense')) {
      where.type = type;
    }

    if (accountId) {
      where.accountId = parseInt(accountId);
    }

    return await prisma.transactions.findMany({
      where,
      orderBy: { release_date: 'asc' },
      select: {
        type: true,
        name: true,
        category: true,
        value: true,
        value_installment: true,
        release_date: true,
        account: { select: { name: true } },
        paymentMethod: { select: { name: true } },
      }
    });
  }

  static async listTransactions(filters, skip, take, order) {
    let where = { ...filters };

    // Esse if serve para filtrar da seguinte maneira, busca todas as transações apartir do dia informado até o final do mês escolhido
    if (filters.release_date) {
      const inputDate = new Date(filters.release_date + 'T00:00:00.000Z');
      const year = inputDate.getUTCFullYear();
      const month = inputDate.getUTCMonth(); // conta a partir de 0, então janeiro é 0, fevereiro é 1, etc.
      const day = inputDate.getUTCDate();

      // Aqui é criado um range de datas para o filtro - usando UTC
      const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

      delete where.release_date;
      where.release_date = {
        gte: startDate,
        lte: endDate
      };0
    }

    const takeSafe = (typeof take === 'number' && !isNaN(take)) ? take : 5;

    const result = await prisma.transactions.findMany({
      where,
      skip: skip,
      take: takeSafe,
      orderBy: { id: order },
      select: {
        id: true,
        type: true,
        name: true,
        category: true,
        value: true,
        value_installment: true,
        release_date: true,
        number_installments: true,
        current_installment: true,
        description: true,
        recurring: true,
        recurring_type: true,
        accountId: true,
        paymentMethodId: true,
        userId: true,
        account: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        paymentMethod: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
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
    if (filters && filters.release_date) {
      const inputDate = new Date(filters.release_date + 'T00:00:00.000Z'); // Force UTC
      const year = inputDate.getUTCFullYear();
      const month = inputDate.getUTCMonth();
      const day = inputDate.getUTCDate();

      const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
      // Remove release_date do where original e substitui pelo range
      delete where.release_date;
      where.release_date = {
        gte: startDate,
        lte: endDate
      };
    }

    return await prisma.transactions.count({ where });
  }

  static async createTransaction(transactionData) {
    const { accountId, paymentMethodId, userId, release_date, ...otherData } = transactionData;

    // Verificar se a conta existe e pertence ao usuário
    const account = await prisma.accounts.findFirst({
      where: { id: accountId, userId: userId }
    });
    if (!account) {
      throw { code: 404, message: "Conta não encontrada ou não pertence ao usuário" };
    }

    // Verificar se o método de pagamento é compatível com a conta
    const accountPaymentMethod = await prisma.accountPaymentMethods.findFirst({
      where: {
        accountId: accountId,
        paymentMethodId: paymentMethodId
      }
    });
    if (!accountPaymentMethod) {
      throw { code: 400, message: "Método de pagamento não é compatível com a conta selecionada" };
    }

    // Converter a data para objeto Date se for uma string
    let parsedReleaseDate = release_date;
    if (typeof release_date === 'string') {
      parsedReleaseDate = new Date(release_date + 'T00:00:00.000Z');
    }

    return await prisma.transactions.create({
      data: {
        ...otherData,
        release_date: parsedReleaseDate,
        account: { connect: { id: accountId } },
        paymentMethod: { connect: { id: paymentMethodId } },
        user: { connect: { id: userId } }
      },
      select: {
        id: true,
        type: true,
        name: true,
        category: true,
        value: true,
        value_installment: true,
        release_date: true,
        number_installments: true,
        current_installment: true,
        recurring: true,
        recurring_type: true,
        accountId: true,
        paymentMethodId: true,
        userId: true,
        account: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        paymentMethod: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  static async updateTransaction(id, transactionData) {
    const { accountId, paymentMethodId, release_date, ...otherData } = transactionData;

    // Verificar se a transação existe
    const existingTransaction = await prisma.transactions.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingTransaction) {
      throw { code: 404, message: "Transação não encontrada" };
    }

    // Se a conta ou método de pagamento estão sendo alterados, validar compatibilidade
    if (accountId && paymentMethodId) {
      const accountPaymentMethod = await prisma.accountPaymentMethods.findFirst({
        where: {
          accountId: accountId,
          paymentMethodId: paymentMethodId
        }
      });
      if (!accountPaymentMethod) {
        throw { code: 400, message: "Método de pagamento não é compatível com a conta selecionada" };
      }
    }

    const updateData = { ...otherData };
    if (accountId) updateData.accountId = accountId;
    if (paymentMethodId) updateData.paymentMethodId = paymentMethodId;

    // Converter a data para objeto Date se for uma string
    if (release_date) {
      if (typeof release_date === 'string') {
        updateData.release_date = new Date(release_date + 'T00:00:00.000Z');
      } else {
        updateData.release_date = release_date;
      }
    }

    return await prisma.transactions.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        type: true,
        name: true,
        category: true,
        value: true,
        release_date: true,
        number_installments: true,
        current_installment: true,
        recurring: true,
        recurring_type: true,
        accountId: true,
        paymentMethodId: true,
        userId: true,
        account: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        paymentMethod: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  static async deleteTransaction(id, userId) {
    const existingTransaction = await prisma.transactions.findUnique({
      where: { id: parseInt(id), userId: parseInt(userId) }
    });
    if (!existingTransaction) {
      throw { code: 404, message: "Transação não encontrada" };
    }

    await prisma.transactions.delete({
      where: { id: parseInt(id) }
    });
    return { message: "Transação deletada com sucesso" };
  }

  /**
   * Busca todas as transações marcadas como recorrentes
   */
  static async getRecurringTransactions() {
    return await prisma.transactions.findMany({
      where: {
        recurring: true
      },
      select: {
        id: true,
        type: true,
        name: true,
        category: true,
        value: true,
        release_date: true,
        recurring: true,
        recurring_type: true,
        accountId: true,
        paymentMethodId: true,
        userId: true
      }
    });
  }

  /**
   * Busca transações recorrentes por tipo específico
   */
  static async getRecurringTransactionsByType(recurringType) {
    return await prisma.transactions.findMany({
      where: {
        recurring: true,
        recurring_type: recurringType
      },
      select: {
        id: true,
        type: true,
        name: true,
        category: true,
        value: true,
        release_date: true,
        recurring: true,
        recurring_type: true,
        accountId: true,
        paymentMethodId: true,
        userId: true
      }
    });
  }

  /**
   * Verifica se já existe uma transação com os mesmos dados para o período especificado
   */
  static async checkTransactionExistsInPeriod(userId, name, category, value, type, accountId, paymentMethodId, startDate, endDate) {
    const existingTransaction = await prisma.transactions.findFirst({
      where: {
        userId: userId,
        name: name,
        category: category,
        value: value,
        type: type,
        accountId: accountId,
        paymentMethodId: paymentMethodId,
        release_date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return existingTransaction !== null;
  }

  /**
   * Verifica se já existe uma transação com os mesmos dados para o mês/ano especificado
   */
  static async checkTransactionExistsInMonth(userId, name, category, value, type, accountId, paymentMethodId, month, year) {
    // Criar o range de datas para o mês especificado
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)); // mês - 1 porque Date usa 0-11
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); // último dia do mês

    const existingTransaction = await prisma.transactions.findFirst({
      where: {
        userId: userId,
        name: name,
        category: category,
        value: value,
        type: type,
        accountId: accountId,
        paymentMethodId: paymentMethodId,
        release_date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return existingTransaction !== null;
  }

  /**
   * Busca todas as transações parceladas que ainda não foram finalizadas
   */
  static async getInstallmentTransactions() {
    const transactions = await prisma.transactions.findMany({
      where: {
        number_installments: {
          not: null
        },
        current_installment: {
          not: null
        }
      },
      select: {
        id: true,
        type: true,
        name: true,
        category: true,
        value: true,
        value_installment: true,
        release_date: true,
        number_installments: true,
        current_installment: true,
        recurring: true,
        recurring_type: true,
        description: true,
        accountId: true,
        paymentMethodId: true,
        userId: true
      }
    });

    // Filtrar no JavaScript para garantir que current_installment < number_installments
    return transactions.filter(transaction =>
      transaction.current_installment < transaction.number_installments
    );
  }

  /**
   * Verifica se já existe uma parcela específica com os mesmos dados para o mês/ano especificado
   */
  static async checkInstallmentExistsInMonth(userId, name, category, value, type, accountId, paymentMethodId, number_installments, current_installment, month, year) {
    // Criar o range de datas para o mês especificado, isso funciona da seguinte maneira:
    // - startDate: primeiro dia do mês (00:00:00.000)
    // - endDate: último dia do mês (23:59:59.999)
    // Isso garante que todas as transações do mês sejam verificadas corretamente.
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const existingInstallment = await prisma.transactions.findFirst({
      where: {
        userId: userId,
        name: name,
        category: category,
        value: value,
        type: type,
        accountId: accountId,
        paymentMethodId: paymentMethodId,
        number_installments: number_installments,
        current_installment: current_installment,
        release_date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return existingInstallment !== null;
  }

  /**
   * Retorna a release_date da transação recorrente mensal mais antiga da mesma série
   * Retorna null se não encontrar
   */
  static async getOldestRecurringReleaseDate({ userId, name, category, type, accountId, paymentMethodId }) {
    const oldest = await prisma.transactions.findFirst({
      where: {
        userId: userId,
        name: name,
        category: category,
        type: type,
        accountId: accountId,
        paymentMethodId: paymentMethodId,
        recurring: true,
        recurring_type: 'monthly'
      },
      orderBy: { release_date: 'asc' },
      select: { release_date: true }
    });

    return oldest ? oldest.release_date : null;
  }

  /**
   * Retorna a release_date da primeira parcela (current_installment = 1) da mesma série
   * Retorna null se não encontrar
   */
  static async getFirstInstallmentReleaseDate({ userId, name, category, type, accountId, paymentMethodId, number_installments }) {
    const first = await prisma.transactions.findFirst({
      where: {
        userId: userId,
        name: name,
        category: category,
        type: type,
        accountId: accountId,
        paymentMethodId: paymentMethodId,
        number_installments: number_installments,
        current_installment: 1
      },
      orderBy: { release_date: 'asc' },
      select: { release_date: true }
    });

    return first ? first.release_date : null;
  }

  /**
   * @calculateTotals Calcula os totais de receitas e despesas baseado nos filtros aplicados
   */
  static async calculateTotals(filters) {
    let where = { ...filters };
    if (filters.release_date) {
      const inputDate = new Date(filters.release_date + 'T00:00:00.000Z');
      const year = inputDate.getUTCFullYear();
      const month = inputDate.getUTCMonth();
      const day = inputDate.getUTCDate();

      const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

      delete where.release_date;
      where.release_date = {
        gte: startDate,
        lte: endDate
      };
    }

    // Buscar todas as transações para calcular corretamente
    const allTransactions = await prisma.transactions.findMany({
      where,
      select: {
        type: true,
        value: true,
        value_installment: true
      }
    });

    const totals = allTransactions.reduce((acc, transaction) => {
      // Usar value_installment se existir, senão usar value
      const value = new Decimal(transaction.value_installment || transaction.value || 0);
      
      if (transaction.type === 'income') {
        acc.totalIncome = acc.totalIncome.plus(value);
      } else if (transaction.type === 'expense') {
        acc.totalExpense = acc.totalExpense.plus(value);
      }

      return acc;
    }, {
      totalIncome: new Decimal(0),
      totalExpense: new Decimal(0)
    });

    return {
      totalIncome: totals.totalIncome.toNumber(),
      totalExpense: totals.totalExpense.toNumber(),
      netBalance: totals.totalIncome.minus(totals.totalExpense).toNumber()
    };
  }
}

export default TransactionRepository;