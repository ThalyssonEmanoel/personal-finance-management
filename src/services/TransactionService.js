import TransactionRepository from '../repositories/TransactionRepository.js';
import TransactionSchemas from '../schemas/TransactionSchemas.js';
import AccountSchemas from '../schemas/AccountsSchemas.js';
import AccountRepository from '../repositories/AccountRepository.js';
import Decimal from "decimal.js";

class TransactionService {
  static async listTransactions(filtros, order = 'asc') {
    const validFiltros = TransactionSchemas.listTransaction.parse(filtros);
    const page = validFiltros.page ?? 1;
    const limit = validFiltros.limit ?? 10;
    const { page: _p, limit: _l, ...dbFilters } = validFiltros;

    if (dbFilters.id) {
      dbFilters.id = parseInt(dbFilters.id);
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);
    const [transactions, total] = await Promise.all([
      TransactionRepository.listTransactions(dbFilters, skip, take, order),
      TransactionRepository.countTransactions(dbFilters)
    ]);
    return { transactions, total, take };
  }

  static async createTransaction(transaction) {
    const validTransaction = TransactionSchemas.createTransaction.parse(transaction);

    /** Esse if é o mais simples, pois não envolve parcelas e nem recorrência.
     * Basicamente o que ele faz é verificar se a transação é uma despesa simples,
     * caso seja, irá atualizar o saldo da conta correspondente.
     * Busca a conta pelo ID e atualiza o saldo subtraindo o valor da transação utiliznado a biblioteca Decimal.js que é mais precisa para cálculos financeiros,
     * por que ela evita problemas de precisão que podem ocorrer com números de ponto flutuante em JavaScript.
     */
    if (validTransaction.type === "expense" && validTransaction.number_installments === undefined &&
      validTransaction.current_installment === undefined) {

      const id = validTransaction.accountId;
      const userId = validTransaction.userId;
      const accounts = await AccountRepository.listAccounts({ id, userId }, 0, 1, 'asc');

      const account = accounts[0];
      const balance = new Decimal(account.balance);
      const spent = new Decimal(validTransaction.value);

      let newBalance = balance.minus(spent);
      await AccountRepository.updateAccount(id, userId, { balance: newBalance.toNumber() });

    } else if (validTransaction.type === "income" && validTransaction.number_installments === undefined &&
      validTransaction.current_installment === undefined) {

      // Lógica para receitas simples (adicionar ao saldo)
      const id = validTransaction.accountId;
      const userId = validTransaction.userId;
      const accounts = await AccountRepository.listAccounts({ id, userId }, 0, 1, 'asc');

      const account = accounts[0];
      const balance = new Decimal(account.balance);
      const income = new Decimal(validTransaction.value);

      let newBalance = balance.plus(income);
      await AccountRepository.updateAccount(id, userId, { balance: newBalance.toNumber() });
    }
    // } else if (validTransaction.type === "expense" && validTransaction.number_installments > 0 &&
    //   validTransaction.current_installment > 0) {
    // }

    const newTransaction = await TransactionRepository.createTransaction(validTransaction);
    if (!newTransaction) {
      throw { code: 404 };
    }
    return newTransaction;
  }

  static async updateTransaction(id, userId, transactionData) {
    const validId = TransactionSchemas.transactionIdParam.parse({ id });
    const validUserId = AccountSchemas.userIdParam.parse({ userId });
    const validTransactionData = TransactionSchemas.updateTransaction.parse(transactionData);

    const updatedTransaction = await TransactionRepository.updateTransaction(validId.id, validUserId.userId, validTransactionData);
    if (!updatedTransaction) {
      throw { code: 404 };
    }
    return updatedTransaction;
  }

  static async deleteTransaction(id) {
    const validId = TransactionSchemas.transactionIdParam.parse({ id });
    const result = await TransactionRepository.deleteTransaction(validId.id);
    return result;
  }

  static async getCompatiblePaymentMethods(accountId) {
    const validAccountId = TransactionSchemas.accountIdParam.parse({ accountId });
    const compatibleMethods = await TransactionRepository.getCompatiblePaymentMethods(validAccountId.accountId);

    return compatibleMethods.map(apm => ({
      id: apm.paymentMethod.id,
      name: apm.paymentMethod.name
    }));
  }

  /**
   * Processa transações recorrentes e cria novas transações automaticamente.
   * Só cria nova transação se a existente for do mês anterior e mesmo ano.
   * Atualiza automaticamente o saldo da conta vinculada.
   */
  static async processRecurringTransactions() {
    // Buscar todas as transações recorrentes
    const recurringTransactions = await TransactionRepository.getRecurringTransactions();

    if (!recurringTransactions || recurringTransactions.length === 0) {
      console.log('[CRON] Nenhuma transação recorrente encontrada');
      return;
    }

    const today = new Date();
    const currentDay = today.getUTCDate(); // Usar UTC para consistência
    const currentMonth = today.getUTCMonth() + 1; // getUTCMonth() retorna 0-11 por isso o +1
    const currentYear = today.getUTCFullYear();

    // Calcular mês anterior
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    console.log(`[CRON] Processando ${recurringTransactions.length} transações recorrentes para ${currentDay}/${currentMonth}/${currentYear}`);
    console.log(`[CRON] Buscando transações do mês anterior: ${previousMonth}/${previousYear}`);

    for (const transaction of recurringTransactions) {
      const releaseDate = new Date(transaction.release_date);
      const transactionDay = releaseDate.getUTCDate();// Usar UTC para evitar problemas de fuso horário
      const transactionMonth = releaseDate.getUTCMonth() + 1;
      const transactionYear = releaseDate.getUTCFullYear();

      console.log(`[CRON] Verificando transação: ${transaction.name} - Data: ${transactionDay}/${transactionMonth}/${transactionYear} (esperado: ${currentDay}/${previousMonth}/${previousYear})`);

      // Verificar se hoje é o dia da recorrência E se a transação é do mês anterior do mesmo ano
      if (transactionDay === currentDay &&
        transactionMonth === previousMonth &&
        transactionYear === previousYear) {

        // Verificar se já existe uma transação IGUAL para o mês atual
        const existsInCurrentMonth = await TransactionRepository.checkTransactionExistsInMonth(
          transaction.userId,
          transaction.name,
          transaction.category,
          transaction.value,
          transaction.type,
          transaction.accountId,
          transaction.paymentMethodId,
          currentMonth,
          currentYear
        );

        if (!existsInCurrentMonth) {
          // Criar nova transação recorrente
          const newTransactionData = {
            type: transaction.type,
            name: transaction.name,
            category: transaction.category,
            value: transaction.value,
            release_date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`, //Esse padStart é para garantir que o mês e o dia tenham dois dígitos
            recurring: true,
            accountId: transaction.accountId,
            paymentMethodId: transaction.paymentMethodId,
            userId: transaction.userId
          };

          // Adicionar campos opcionais apenas se não forem null/undefined
          if (transaction.billing_day !== null && transaction.billing_day !== undefined) {
            newTransactionData.billing_day = transaction.billing_day;
          }
          if (transaction.number_installments !== null && transaction.number_installments !== undefined) {
            newTransactionData.number_installments = transaction.number_installments;
          }
          if (transaction.current_installment !== null && transaction.current_installment !== undefined) {
            newTransactionData.current_installment = transaction.current_installment;
          }

          // Usar o método createTransaction existente para manter a lógica de atualização de saldo
          const newTransaction = await this.createTransaction(newTransactionData);
          if (!newTransaction) {
            throw { code: 500, message: "Erro ao criar transação recorrente" };
          }

          console.log(`[CRON] Nova transação recorrente criada: ${transaction.name} - R$ ${transaction.value} (do mês ${previousMonth}/${previousYear} para ${currentMonth}/${currentYear})`);
        } else {
          console.log(`[CRON] Transação já existe para o mês atual: ${transaction.name}`);
        }
      } else {
        if (transactionDay !== currentDay && (transactionMonth !== previousMonth || transactionYear !== previousYear)) {
          console.log(`Não foi cadastrada.`);
        }
      }
    }
    console.log('[CRON] Processamento de transações recorrentes concluído');
  }
}

export default TransactionService;