import TransactionRepository from '../repositories/TransactionRepository.js';
import TransactionSchemas from '../schemas/TransactionSchemas.js';
import AccountSchemas from '../schemas/AccountsSchemas.js';
import AccountRepository from '../repositories/AccountRepository.js';
import Decimal from "decimal.js";

class TransactionService {
  static async getTransactionsForPDF({ userId, startDate, endDate, type, accountId }) {
    if (!userId || !startDate || !endDate || !type) {
      throw { code: 400, message: 'Parâmetros obrigatórios: userId, startDate, endDate, type' };
    }
    // type pode ser 'all', 'income', 'expense'
    const queryType = type === 'all' ? undefined : type;
    return await TransactionRepository.listTransactionsForPDF(parseInt(userId), startDate, endDate, queryType, accountId);
  }

  static async listTransactions(filtros, order = 'asc') {
    const validFiltros = TransactionSchemas.listTransaction.parse(filtros);

    const page = validFiltros.page ?? 1;
    const limit = validFiltros.limit ?? 5;
    const { page: _p, limit: _l, ...dbFilters } = validFiltros;

    if (dbFilters.id) {
      dbFilters.id = parseInt(dbFilters.id);
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit) || 5;
    const [transactions, total, totals] = await Promise.all([
      TransactionRepository.listTransactions(dbFilters, skip, take, order),
      TransactionRepository.countTransactions(dbFilters),
      TransactionRepository.calculateTotals(dbFilters)
    ]);

    const data = {
      transactions,
      totalIncome: totals.totalIncome,
      totalExpense: totals.totalExpense,
      netBalance: totals.netBalance
    };

    return {
      data,
      total,
      take
    };
  }
  /**
   * Calcula os valores das parcelas para transações parceladas
   * @private
   */
  static _calculateInstallmentValues(validTransaction) {
    if (validTransaction.number_installments && validTransaction.number_installments > 1) {
      const totalValue = new Decimal(validTransaction.value);
      const numberOfInstallments = validTransaction.number_installments;
      const baseInstallmentValue = totalValue.dividedBy(numberOfInstallments);
      const standardInstallmentValue = baseInstallmentValue.toDecimalPlaces(2, Decimal.ROUND_DOWN);

      validTransaction.value_installment = standardInstallmentValue.toNumber();

      if (validTransaction.current_installment === undefined || validTransaction.current_installment === null) {
        validTransaction.current_installment = 1;
      }
    }
  }

  /**
   * Verifica se a transação deve atualizar o saldo da conta
   * @private
   */
  static _shouldUpdateAccountBalance(validTransaction) {
    return (validTransaction.type === "expense" || validTransaction.type === "income") &&
      validTransaction.accountId && validTransaction.userId;
  }

  /**
   * Atualiza o saldo da conta baseado na transação
   * @private
   */
  static async _updateAccountBalanceForTransaction(validTransaction) {
    if (this._shouldUpdateAccountBalance(validTransaction)) {
      await this.updateAccountBalance({
        accountId: validTransaction.accountId,
        userId: validTransaction.userId,
        amount: validTransaction.value_installment ?? validTransaction.value,
        operation: validTransaction.type === "income" ? 'add' : 'subtract'
      });
    }
  }


  /**
   * 
   * @createTransaction 
   * Implementei os métodos _calculateInstallmentValues, _updateAccountBalanceForTransaction e _shouldUpdateAccountBalance
   * para seguir o conceito de Single Responsibility Principle (SRP) e manter o código mais modular e testável. PORQUE TESTAR ISSO ESTÁ SENDO UMA CHATICE.
   */
  static async createTransaction(transaction) {
    const validTransaction = TransactionSchemas.createTransaction.parse(transaction);

    // Calcular valores das parcelas se necessário
    this._calculateInstallmentValues(validTransaction);

    // Atualizar saldo da conta se necessário
    await this._updateAccountBalanceForTransaction(validTransaction);

    // Criar a transação no banco de dados
    const newTransaction = await TransactionRepository.createTransaction(validTransaction);
    if (!newTransaction) {
      throw { code: 404 };
    }
    return newTransaction;
  }

  static async updateAccountBalance({ accountId, userId, amount, operation }) {
    const accounts = await AccountRepository.listAccounts({ id: accountId, userId }, 0, 1, 'asc');
    const account = accounts[0];
    const balance = new Decimal(account.balance);
    const newBalance = operation === 'add' ? balance.plus(amount) : balance.minus(amount);
    await AccountRepository.updateAccount(accountId, userId, { balance: newBalance.toNumber() });
  }

  static async updateTransaction(id, userId, transactionData) {
    const validId = TransactionSchemas.transactionIdParam.parse({ id });
    const validUserId = AccountSchemas.userIdParam.parse({ userId });
    const validTransactionData = TransactionSchemas.updateTransaction.parse(transactionData);

    // Filtrar campos vazios/nulos para não serem processados
    const filteredData = {};
    Object.keys(validTransactionData).forEach(key => {
      const value = validTransactionData[key];
      if (value !== undefined && value !== null && value !== "") {
        filteredData[key] = value;
      }
    });

    // 1. Buscar a transação antiga
    const oldTransactionArr = await TransactionRepository.listTransactions(
      { id: validId.id, userId: validUserId.userId }, 0, 1, 'asc');
    if (!oldTransactionArr || oldTransactionArr.length === 0) {
      throw { code: 404, message: "Transação não encontrada" };
    }
    const oldTransaction = oldTransactionArr[0];

    // 2. Atualizar saldo da conta se necessário
    // Só se for income/expense e não mudou de conta
    if (
      (oldTransaction.type === 'income' || oldTransaction.type === 'expense') &&
      oldTransaction.accountId &&
      (!filteredData.accountId || filteredData.accountId === oldTransaction.accountId)
    ) {
      const oldValue = new Decimal(oldTransaction.value_installment || oldTransaction.value || 0);
      const newValue = new Decimal(filteredData.value_installment ?? filteredData.value ?? oldValue);

      // Se mudou o valor
      if (!oldValue.equals(newValue)) {
        // Reverte o valor antigo
        const reverseOp = oldTransaction.type === 'income' ? 'subtract' : 'add';
        await this.updateAccountBalance({
          accountId: oldTransaction.accountId,
          userId: validUserId.userId,
          amount: oldValue,
          operation: reverseOp
        });
        // Aplica o novo valor
        const applyOp = oldTransaction.type === 'income' ? 'add' : 'subtract';
        await this.updateAccountBalance({
          accountId: oldTransaction.accountId,
          userId: validUserId.userId,
          amount: newValue,
          operation: applyOp
        });
      }
    }

    // 3. Atualizar a transação no banco
    const updatedTransaction = await TransactionRepository.updateTransaction(validId.id, filteredData);
    if (!updatedTransaction) {
      throw { code: 404 };
    }
    return updatedTransaction;
  }

  static async deleteTransaction(id, userId) {
    const validId = AccountSchemas.accountIdParam.parse({ id });
    const validUserId = AccountSchemas.userIdParam.parse({ userId });
    // Primeiro, buscar a transação para obter os dados antes de deletá-la
    const transactionToDelete = await TransactionRepository.listTransactions(
      { id: validId.id, userId: validUserId.userId }, 0, 1, 'asc');

    if (!transactionToDelete || transactionToDelete.length === 0) {
      throw { code: 404, message: "Transação não encontrada" };
    }

    const transaction = transactionToDelete[0];

    // Reverter o impacto no saldo da conta antes de deletar a transação
    if (transaction.accountId && (transaction.type === 'income' || transaction.type === 'expense')) {
      const amountToRevert = transaction.value_installment || transaction.value;

      // Para reverter: se foi expense (subtraiu), agora soma. Se foi income (somou), agora subtrai
      const reverseOperation = transaction.type === 'expense' ? 'add' : 'subtract';

      await this.updateAccountBalance({
        accountId: transaction.accountId,
        userId: validUserId.userId,
        amount: amountToRevert,
        operation: reverseOperation
      });
    }

    const result = await TransactionRepository.deleteTransaction(validId.id, validUserId.userId);
    return result;
  }

  /**
   * Processa transações recorrentes e cria novas transações automaticamente.
   * Suporta diferentes tipos de recorrência: diária, semanal, mensal e anual.
   * Atualiza automaticamente o saldo da conta vinculada.
   */
  static async processRecurringTransactions() {
    const recurringTransactions = await TransactionRepository.getRecurringTransactions();

    if (!recurringTransactions || recurringTransactions.length === 0) {
      return;
    }

    const today = new Date();
    const rondonia = new Date(today.getTime() - (4 * 60 * 60 * 1000)); // UTC-4, se eu não deixar dessa forma buga horário de rondônia

    console.log("----------------------------------------------------------------------------------------------------------------------------");
    console.log(`[RECORRENTE] Processando ${recurringTransactions.length} transações recorrentes para ${rondonia.toISOString().split('T')[0]}`);

    for (const transaction of recurringTransactions) {
      const recurringType = transaction.recurring_type || 'monthly'; // Default para monthly para compatibilidade
      
      try {
        let shouldCreateTransaction = false;
        let newReleaseDate = null;

        switch (recurringType) {
          case 'daily':
            shouldCreateTransaction = await this._checkDailyRecurrence(transaction, rondonia);
            newReleaseDate = this._calculateDailyNextDate(transaction, rondonia);
            break;
          case 'weekly':
            shouldCreateTransaction = await this._checkWeeklyRecurrence(transaction, rondonia);
            newReleaseDate = this._calculateWeeklyNextDate(transaction, rondonia);
            break;
          case 'monthly':
            shouldCreateTransaction = await this._checkMonthlyRecurrence(transaction, rondonia);
            newReleaseDate = this._calculateMonthlyNextDate(transaction, rondonia);
            break;
          case 'yearly':
            shouldCreateTransaction = await this._checkYearlyRecurrence(transaction, rondonia);
            newReleaseDate = this._calculateYearlyNextDate(transaction, rondonia);
            break;
          default:
            console.log(`[RECORRENTE] Tipo de recorrência desconhecido: ${recurringType} para transação ${transaction.name}`);
            continue;
        }

        if (shouldCreateTransaction && newReleaseDate) {
          await this._createRecurringTransaction(transaction, newReleaseDate, recurringType);
        }
      } catch (error) {
        console.error(`[RECORRENTE] Erro ao processar transação ${transaction.name}:`, error);
      }
    }
    console.log('[RECORRENTE] Processamento de transações recorrentes concluído');
  }

  /**
   * Processa transações parceladas e cria as próximas parcelas automaticamente.
   * Só cria nova parcela se a existente for do mês anterior e ainda não atingiu o total de parcelas.
   * Incrementa a current_installment automaticamente.
   * Atualiza automaticamente o saldo da conta vinculada.
   */
  static async processInstallmentsTransactions() {
    const installmentTransactions = await TransactionRepository.getInstallmentTransactions();

    if (!installmentTransactions || installmentTransactions.length === 0) {
      return;
    }

    // Usar fuso horário de Rondônia (UTC-4)
    const today = new Date();
    const rondonia = new Date(today.getTime() - (4 * 60 * 60 * 1000)); // UTC-4
    const currentDay = rondonia.getUTCDate();
    const currentMonth = rondonia.getUTCMonth() + 1;
    const currentYear = rondonia.getUTCFullYear();

    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    console.log("----------------------------------------------------------------------------------------------------------------------------");
    console.log(`[PARCELA] Processando ${installmentTransactions.length} transações parceladas para ${currentDay}/${currentMonth}/${currentYear}`);
    console.log(`[PARCELA] Buscando transações parceladas do mês anterior: ${previousMonth}/${previousYear}`);

    // Filtrar apenas transações que ainda têm parcelas pendentes
    const pendingInstallments = installmentTransactions.filter(
      transaction => transaction.current_installment < transaction.number_installments
    );
    for (const transaction of pendingInstallments) {
      if (transaction.current_installment >= transaction.number_installments) {
        console.log(`[PARCELA] AVISO: Transação ${transaction.name} já está completa (${transaction.current_installment}/${transaction.number_installments}) - pulando`);
        continue;
      }

      const releaseDate = new Date(transaction.release_date);
      const transactionDay = releaseDate.getUTCDate();
      const transactionMonth = releaseDate.getUTCMonth() + 1;
      const transactionYear = releaseDate.getUTCFullYear();

      // Verificar se hoje é o dia da próxima parcela e se a transação é do mês anterior do mesmo ano
      if (transactionDay === currentDay &&
        transactionMonth === previousMonth &&
        transactionYear === previousYear) {

        // Dupla verificação: garantir que ainda há parcelas a serem processadas
        if (transaction.current_installment < transaction.number_installments) {
          const nextInstallment = transaction.current_installment + 1;

          // Tripla verificação: garantir que a próxima parcela não excede o máximo
          if (nextInstallment > transaction.number_installments) {
            console.log(`[PARCELA] Ignorando transação ${transaction.name}: próxima parcela (${nextInstallment}) excederia o máximo (${transaction.number_installments})`);
            continue;
          }

          const existsInCurrentMonth = await TransactionRepository.checkInstallmentExistsInMonth(
            transaction.userId,
            transaction.name,
            transaction.category,
            transaction.value,
            transaction.type,
            transaction.accountId,
            transaction.paymentMethodId,
            transaction.number_installments,
            nextInstallment,
            currentMonth,
            currentYear
          );

          if (!existsInCurrentMonth) {
            let installmentValue = transaction.value_installment;

            // Sempre recalcular se é a última parcela para garantir que o total seja exato
            if (nextInstallment === transaction.number_installments && transaction.value) {
              const totalValue = new Decimal(transaction.value);
              const currentInstallmentValue = new Decimal(transaction.value_installment);

              // Calcular quanto já foi pago nas parcelas anteriores
              const previousInstallments = new Decimal(nextInstallment - 1);
              const paidSoFar = currentInstallmentValue.mul(previousInstallments);

              // A última parcela é o que resta
              const lastInstallmentValue = totalValue.minus(paidSoFar);
              installmentValue = lastInstallmentValue.toNumber();

              console.log(`[PARCELA] Última parcela ${nextInstallment}/${transaction.number_installments}: ajustando valor para R$ ${installmentValue} (resto: R$ ${lastInstallmentValue.minus(currentInstallmentValue).toNumber()})`);
            } else {
              console.log(`[PARCELA] Parcela ${nextInstallment}/${transaction.number_installments}: valor padrão R$ ${installmentValue}`);
            }

            const newInstallmentData = {
              type: transaction.type,
              name: transaction.name,
              category: transaction.category,
              value: transaction.value,
              value_installment: installmentValue,
              release_date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`,
              number_installments: transaction.number_installments,
              current_installment: nextInstallment,
              recurring: false,
              accountId: transaction.accountId,
              paymentMethodId: transaction.paymentMethodId,
              userId: transaction.userId
            };

            if (transaction.description !== null && transaction.description !== undefined) {
              newInstallmentData.description = transaction.description;
            }

            const newTransaction = await this.createTransaction(newInstallmentData);
            if (!newTransaction) {
              throw { code: 500, message: "Erro ao criar próxima parcela" };
            }

            console.log(`[PARCELA] Nova parcela criada: ${transaction.name} - Parcela ${nextInstallment}/${transaction.number_installments} - R$ ${installmentValue} (do mês ${previousMonth}/${previousYear} para ${currentMonth}/${currentYear})`);
          } else {
            console.log(`[PARCELA] Parcela já existe para o mês atual: ${transaction.name} - Parcela ${nextInstallment}/${transaction.number_installments}`);
          }
        }
      }
    }
    console.log('[PARCELA] Processamento de transações parceladas concluído');
  }

  /**
   * Métodos auxiliares para diferentes tipos de recorrência
   */
  
  // Recorrência Diária
  static async _checkDailyRecurrence(transaction, currentDate) {
    const transactionDate = new Date(transaction.release_date);
    const yesterday = new Date(currentDate);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    
    // Verifica se a transação é de ontem
    return (
      transactionDate.getUTCDate() === yesterday.getUTCDate() &&
      transactionDate.getUTCMonth() === yesterday.getUTCMonth() &&
      transactionDate.getUTCFullYear() === yesterday.getUTCFullYear()
    );
  }

  static _calculateDailyNextDate(transaction, currentDate) {
    return `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${currentDate.getUTCDate().toString().padStart(2, '0')}`;
  }

  // Recorrência Semanal
  static async _checkWeeklyRecurrence(transaction, currentDate) {
    const transactionDate = new Date(transaction.release_date);
    const lastWeek = new Date(currentDate);
    lastWeek.setUTCDate(lastWeek.getUTCDate() - 7);
    
    // Verifica se a transação é exatamente de uma semana atrás (mesmo dia da semana)
    return (
      transactionDate.getUTCDate() === lastWeek.getUTCDate() &&
      transactionDate.getUTCMonth() === lastWeek.getUTCMonth() &&
      transactionDate.getUTCFullYear() === lastWeek.getUTCFullYear()
    );
  }

  static _calculateWeeklyNextDate(transaction, currentDate) {
    return `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${currentDate.getUTCDate().toString().padStart(2, '0')}`;
  }

  // Recorrência Mensal (método existente, refatorado)
  static async _checkMonthlyRecurrence(transaction, currentDate) {
    const transactionDate = new Date(transaction.release_date);
    const currentDay = currentDate.getUTCDate();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentYear = currentDate.getUTCFullYear();
    
    const transactionDay = transactionDate.getUTCDate();
    const transactionMonth = transactionDate.getUTCMonth() + 1;
    const transactionYear = transactionDate.getUTCFullYear();
    
    // Calcular mês anterior
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    // Verificar se hoje é o dia da recorrência E se a transação é do mês anterior do mesmo ano
    return (
      transactionDay === currentDay &&
      transactionMonth === previousMonth &&
      transactionYear === previousYear
    );
  }

  static _calculateMonthlyNextDate(transaction, currentDate) {
    const currentDay = currentDate.getUTCDate();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentYear = currentDate.getUTCFullYear();
    
    return `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
  }

  // Recorrência Anual
  static async _checkYearlyRecurrence(transaction, currentDate) {
    const transactionDate = new Date(transaction.release_date);
    const currentDay = currentDate.getUTCDate();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentYear = currentDate.getUTCFullYear();
    
    const transactionDay = transactionDate.getUTCDate();
    const transactionMonth = transactionDate.getUTCMonth() + 1;
    const transactionYear = transactionDate.getUTCFullYear();
    
    // Verifica se hoje é o mesmo dia e mês, mas a transação é do ano anterior
    return (
      transactionDay === currentDay &&
      transactionMonth === currentMonth &&
      transactionYear === (currentYear - 1)
    );
  }

  static _calculateYearlyNextDate(transaction, currentDate) {
    const transactionDate = new Date(transaction.release_date);
    const currentYear = currentDate.getUTCFullYear();
    const transactionMonth = transactionDate.getUTCMonth() + 1;
    const transactionDay = transactionDate.getUTCDate();
    
    return `${currentYear}-${transactionMonth.toString().padStart(2, '0')}-${transactionDay.toString().padStart(2, '0')}`;
  }

  // Método para criar transação recorrente
  static async _createRecurringTransaction(originalTransaction, newReleaseDate, recurringType) {
    // Calcular o período de verificação baseado no tipo de recorrência
    const newDate = new Date(newReleaseDate);
    let startDate, endDate;

    switch (recurringType) {
      case 'daily':
        startDate = new Date(newDate);
        endDate = new Date(newDate);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
      case 'weekly':
        startDate = new Date(newDate);
        endDate = new Date(newDate);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
      case 'monthly':
        startDate = new Date(Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth(), 1, 0, 0, 0, 0));
        endDate = new Date(Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));
        break;
      case 'yearly':
        startDate = new Date(Date.UTC(newDate.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
        endDate = new Date(Date.UTC(newDate.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
        break;
      default:
        throw new Error(`Tipo de recorrência não suportado: ${recurringType}`);
    }

    // Verificar se já existe uma transação igual no período
    const existsInPeriod = await TransactionRepository.checkTransactionExistsInPeriod(
      originalTransaction.userId,
      originalTransaction.name,
      originalTransaction.category,
      originalTransaction.value,
      originalTransaction.type,
      originalTransaction.accountId,
      originalTransaction.paymentMethodId,
      startDate,
      endDate
    );

    if (!existsInPeriod) {
      const newTransactionData = {
        type: originalTransaction.type,
        name: originalTransaction.name,
        category: originalTransaction.category,
        value: originalTransaction.value,
        release_date: newReleaseDate,
        recurring: true,
        recurring_type: recurringType,
        accountId: originalTransaction.accountId,
        paymentMethodId: originalTransaction.paymentMethodId,
        userId: originalTransaction.userId
      };

      if (originalTransaction.number_installments !== null && originalTransaction.number_installments !== undefined) {
        newTransactionData.number_installments = originalTransaction.number_installments;
      }
      if (originalTransaction.current_installment !== null && originalTransaction.current_installment !== undefined) {
        newTransactionData.current_installment = originalTransaction.current_installment;
      }

      const newTransaction = await this.createTransaction(newTransactionData);
      if (!newTransaction) {
        throw { code: 500, message: "Erro ao criar transação recorrente" };
      }

      console.log(`[RECORRENTE-${recurringType.toUpperCase()}] Nova transação criada: ${originalTransaction.name} - R$ ${originalTransaction.value} para ${newReleaseDate}`);
    } else {
      console.log(`[RECORRENTE-${recurringType.toUpperCase()}] Transação já existe para o período: ${originalTransaction.name}`);
    }
  }
}

export default TransactionService;
