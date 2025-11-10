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
    const queryType = type === 'all' ? undefined : type;
    const response = await TransactionRepository.listTransactionsForPDF(parseInt(userId), startDate, endDate, queryType, accountId);
    return response;
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
   * @private
   * @_calculateInstallmentValues Calcula os valores das parcelas para transações parceladas
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
   * @createTransaction Implementado os métodos PRIVADOS _calculateInstallmentValues, _updateAccountBalanceForTransaction e _shouldUpdateAccountBalance
   * para seguir o conceito de Single Responsibility Principle (SRP) e manter o código mais modular e testável. PORQUE TESTAR ISSO ESTÁ SENDO UMA CHATICE.
   */
  static async createTransaction(transaction) {
    const validTransaction = TransactionSchemas.createTransaction.parse(transaction);

    this._calculateInstallmentValues(validTransaction);
    await this._updateAccountBalanceForTransaction(validTransaction);

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
    const filteredData = {};
    Object.keys(validTransactionData).forEach(key => {
      const value = validTransactionData[key];
      if (value !== undefined && value !== null && value !== "") {
        filteredData[key] = value;
      }
    });

    const oldTransactionArr = await TransactionRepository.listTransactions(
      { id: validId.id, userId: validUserId.userId }, 0, 1, 'asc');
    if (!oldTransactionArr || oldTransactionArr.length === 0) {
      throw { code: 404, message: "Transação não encontrada" };
    }
    const oldTransaction = oldTransactionArr[0];

    if (
      (oldTransaction.type === 'income' || oldTransaction.type === 'expense') &&
      oldTransaction.accountId &&
      (!filteredData.accountId || filteredData.accountId === oldTransaction.accountId)
    ) {
      const oldValue = new Decimal(oldTransaction.value_installment || oldTransaction.value || 0);
      const newValue = new Decimal(filteredData.value_installment ?? filteredData.value ?? oldValue);

      if (!oldValue.equals(newValue)) {
        const reverseOp = oldTransaction.type === 'income' ? 'subtract' : 'add';
        await this.updateAccountBalance({
          accountId: oldTransaction.accountId,
          userId: validUserId.userId,
          amount: oldValue,
          operation: reverseOp
        });
        const applyOp = oldTransaction.type === 'income' ? 'add' : 'subtract';
        await this.updateAccountBalance({
          accountId: oldTransaction.accountId,
          userId: validUserId.userId,
          amount: newValue,
          operation: applyOp
        });
      }
    }

    const updatedTransaction = await TransactionRepository.updateTransaction(validId.id, filteredData);
    if (!updatedTransaction) {
      throw { code: 404 };
    }
    return updatedTransaction;
  }

  static async deleteTransaction(id, userId) {
    const validId = AccountSchemas.accountIdParam.parse({ id });
    const validUserId = AccountSchemas.userIdParam.parse({ userId });
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
            newReleaseDate = await this._calculateMonthlyNextDate(transaction, rondonia);
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
    const rondonia = new Date(today.getTime() - (4 * 60 * 60 * 1000));
    const currentMonth = rondonia.getUTCMonth() + 1;
    const currentYear = rondonia.getUTCFullYear();

    console.log("----------------------------------------------------------------------------------------------------------------------------");
    console.log(`[PARCELA] Processando ${installmentTransactions.length} transações parceladas para ${rondonia.toISOString().split('T')[0]}`);

    // Filtrar apenas transações que ainda têm parcelas pendentes
    const pendingInstallments = installmentTransactions.filter(
      transaction => transaction.current_installment < transaction.number_installments
    );
    for (const transaction of pendingInstallments) {
      if (transaction.current_installment >= transaction.number_installments) {
        console.log(`[PARCELA] AVISO: Transação ${transaction.name} já está completa (${transaction.current_installment}/${transaction.number_installments}) - pulando`);
        continue;
      }

      try {
        // Usar a nova lógica inteligente
        const shouldCreate = await this._shouldCreateNextInstallment(transaction, rondonia);
        
        if (shouldCreate) {
          const nextInstallment = transaction.current_installment + 1;

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
            // Calcular a data correta da próxima parcela
            const nextInstallmentDate = await this._calculateNextInstallmentDate(transaction, rondonia);
            
            let installmentValue = transaction.value_installment;

            if (nextInstallment === transaction.number_installments && transaction.value) {
              const totalValue = new Decimal(transaction.value);
              const currentInstallmentValue = new Decimal(transaction.value_installment);
              const previousInstallments = new Decimal(nextInstallment - 1);
              const paidSoFar = currentInstallmentValue.mul(previousInstallments);
              const lastInstallmentValue = totalValue.minus(paidSoFar);
              installmentValue = lastInstallmentValue.toNumber();

              console.log(`[PARCELA] Última parcela ${nextInstallment}/${transaction.number_installments}: ajustando valor para R$ ${installmentValue}`);
            } else {
              console.log(`[PARCELA] Parcela ${nextInstallment}/${transaction.number_installments}: valor padrão R$ ${installmentValue}`);
            }

            const newInstallmentData = {
              type: transaction.type,
              name: transaction.name,
              category: transaction.category,
              value: transaction.value,
              value_installment: installmentValue,
              release_date: nextInstallmentDate, // Usar a data calculada corretamente
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

            console.log(`[PARCELA] Nova parcela criada: ${transaction.name} - Parcela ${nextInstallment}/${transaction.number_installments} - R$ ${installmentValue} para ${nextInstallmentDate}`);
          } else {
            console.log(`[PARCELA] Parcela já existe para o mês atual: ${transaction.name} - Parcela ${nextInstallment}/${transaction.number_installments}`);
          }
        }
      } catch (error) {
        console.error(`[PARCELA] Erro ao processar parcela ${transaction.name}:`, error);
      }
    }
    console.log('[PARCELA] Processamento de transações parceladas concluído');
  }


  /**
   * Busca o dia original de uma transação recorrente mensal
   * Procura pela transação mais antiga da mesma série recorrente
   */
  static async _findOriginalDayForMonthlyRecurring(transaction) {
    const oldestTransaction = await prisma.transactions.findFirst({
      where: {
        userId: transaction.userId,
        name: transaction.name,
        category: transaction.category,
        type: transaction.type,
        accountId: transaction.accountId,
        paymentMethodId: transaction.paymentMethodId,
        recurring: true,
        recurring_type: 'monthly'
      },
      orderBy: {
        release_date: 'asc'
      },
      select: {
        release_date: true
      }
    });
    
    if (oldestTransaction) {
      return new Date(oldestTransaction.release_date).getUTCDate();
    }
    
    return new Date(transaction.release_date).getUTCDate();
  }

  /**
   * Busca o dia original de uma transação parcelada
   * Procura pela primeira parcela da mesma série
   */
  static async _findOriginalDayForInstallment(transaction) {
    const firstInstallment = await prisma.transactions.findFirst({
      where: {
        userId: transaction.userId,
        name: transaction.name,
        category: transaction.category,
        type: transaction.type,
        accountId: transaction.accountId,
        paymentMethodId: transaction.paymentMethodId,
        number_installments: transaction.number_installments,
        current_installment: 1 // Primeira parcela
      },
      select: {
        release_date: true
      }
    });
    
    if (firstInstallment) {
      return new Date(firstInstallment.release_date).getUTCDate();
    }
    
    return new Date(transaction.release_date).getUTCDate();
  }

  /**
   * Verifica se hoje é o dia correto para criar a próxima parcela
   * Considera dias que não existem em todos os meses (ex: 31)
   */
  static async _shouldCreateNextInstallment(transaction, currentDate) {
    const transactionDate = new Date(transaction.release_date);
    const currentDay = currentDate.getUTCDate();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentYear = currentDate.getUTCFullYear();
    
    const transactionMonth = transactionDate.getUTCMonth() + 1;
    const transactionYear = transactionDate.getUTCFullYear();
    
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    // Verificar se a transação é do mês anterior
    if (transactionMonth !== previousMonth || transactionYear !== previousYear) {
      return false;
    }
    
    // Buscar o dia original da primeira parcela
    const originalDay = await this._findOriginalDayForInstallment(transaction);
    
    // Obter o último dia do mês atual
    const lastDayOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 0)).getUTCDate();
    
    // Se o dia original existe no mês atual, verifica se hoje é esse dia
    if (originalDay <= lastDayOfCurrentMonth) {
      return originalDay === currentDay;
    } else {
      // Se o dia original não existe no mês atual (ex: 31 em fevereiro),
      // verifica se hoje é o último dia do mês atual
      return currentDay === lastDayOfCurrentMonth;
    }
  }

  /**
   * Calcula a data da próxima parcela considerando dias que não existem em todos os meses
   */
  static async _calculateNextInstallmentDate(transaction, currentDate) {
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentYear = currentDate.getUTCFullYear();
    
    // Buscar o dia original da primeira parcela
    const originalDay = await this._findOriginalDayForInstallment(transaction);
    
    // Obter o último dia do mês atual
    const lastDayOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 0)).getUTCDate();
    
    // Se o dia original existe no mês atual, usa esse dia
    // Senão, usa o último dia do mês atual
    const dayToUse = originalDay <= lastDayOfCurrentMonth ? originalDay : lastDayOfCurrentMonth;
    
    return `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${dayToUse.toString().padStart(2, '0')}`;
  }
  
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

  static async _checkMonthlyRecurrence(transaction, currentDate) {
    const transactionDate = new Date(transaction.release_date);
    const currentDay = currentDate.getUTCDate();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentYear = currentDate.getUTCFullYear();
    
    const transactionMonth = transactionDate.getUTCMonth() + 1;
    const transactionYear = transactionDate.getUTCFullYear();
    
    // Calcular mês anterior
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    // Verificar se a transação é do mês anterior
    if (transactionMonth !== previousMonth || transactionYear !== previousYear) {
      return false;
    }
    // Buscar o dia original da primeira transação desta série
    const originalDay = await this._findOriginalDayForMonthlyRecurring(transaction);
    
    // Obter o último dia do mês atual
    const lastDayOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 0)).getUTCDate();
    
    // Se o dia original existe no mês atual, verifica se hoje é esse dia
    if (originalDay <= lastDayOfCurrentMonth) {
      return originalDay === currentDay;
    } else {
      // Se o dia original não existe no mês atual (ex: 31 em fevereiro),
      // verifica se hoje é o último dia do mês atual
      return currentDay === lastDayOfCurrentMonth;
    }
  }

  static async _calculateMonthlyNextDate(transaction, currentDate) {
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentYear = currentDate.getUTCFullYear();
    
    // Buscar o dia original da primeira transação desta série
    const originalDay = await this._findOriginalDayForMonthlyRecurring(transaction);
    
    // Obter o último dia do mês atual
    const lastDayOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth, 0)).getUTCDate();
    
    // Se o dia original existe no mês atual, usa esse dia
    // Senão, usa o último dia do mês atual
    const dayToUse = originalDay <= lastDayOfCurrentMonth ? originalDay : lastDayOfCurrentMonth;
    
    return `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${dayToUse.toString().padStart(2, '0')}`;
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
    const newDate = new Date(newReleaseDate + 'T00:00:00.000Z'); // Garantir formato UTC
    
    // Verificar se a data é válida
    if (isNaN(newDate.getTime())) {
      console.error(`[RECORRENTE] Data inválida: ${newReleaseDate}`);
      return;
    }
    
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
        release_date: newReleaseDate, // String no formato YYYY-MM-DD
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
