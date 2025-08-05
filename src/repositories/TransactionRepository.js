import { prisma } from "../config/prismaClient.js";

class TransactionRepository {

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
      };

      console.log('Final where condition:', JSON.stringify(where, null, 2));
    }

    const result = await prisma.transactions.findMany({
      where,
      skip: skip,
      take: take,
      orderBy: { id: order },
      select: {
        id: true,
        type: true,
        name: true,
        category: true,
        value: true,
        value_installment: true, 
        release_date: true,
        billing_day: true,
        number_installments: true,
        current_installment: true,
        recurring: true,
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
        billing_day: true,
        number_installments: true,
        current_installment: true,
        recurring: true,
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

  static async updateTransaction(id, userId, transactionData) {
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
        billing_day: true,
        number_installments: true,
        current_installment: true,
        recurring: true,
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

  static async deleteTransaction(id) {
    const existingTransaction = await prisma.transactions.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existingTransaction) {
      throw { code: 404, message: "Transação não encontrada" };
    }

    await prisma.transactions.delete({
      where: { id: parseInt(id) }
    });
    return { message: "Transação deletada com sucesso" };
  }

  static async getCompatiblePaymentMethods(accountId) {
    return await prisma.accountPaymentMethods.findMany({
      where: { accountId: parseInt(accountId) },
      include: {
        paymentMethod: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
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
        billing_day: true,
        recurring: true,
        accountId: true,
        paymentMethodId: true,
        userId: true
      }
    });
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
        billing_day: true,
        number_installments: true,
        current_installment: true,
        recurring: true,
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
    // Criar o range de datas para o mês especificado
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
}

export default TransactionRepository;