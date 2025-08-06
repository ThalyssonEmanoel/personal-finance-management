import TransactionRepository from '../repositories/TransactionRepository.js';
import TransactionSchemas from '../schemas/TransactionSchemas.js';
import AccountSchemas from '../schemas/AccountsSchemas.js';
import AccountRepository from '../repositories/AccountRepository.js';
import Decimal from "decimal.js";

class TransactionService {
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
    const recurringTransactions = await TransactionRepository.getRecurringTransactions();

    if (!recurringTransactions || recurringTransactions.length === 0) {
      return;
    }

    const today = new Date();
    const currentDay = today.getUTCDate(); // Usar UTC para consistência UTC usar o horária de Brasília
    const currentMonth = today.getUTCMonth() + 1; // getUTCMonth() retorna 0-11 por isso o +1
    const currentYear = today.getUTCFullYear();

    // Calcular mês anterior
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    console.log("----------------------------------------------------------------------------------------------------------------------------");
    console.log(`[RECORRENTE] Processando ${recurringTransactions.length} transações recorrentes para ${currentDay}/${currentMonth}/${currentYear}`);
    console.log(`[RECORRENTE] Buscando transações do mês anterior: ${previousMonth}/${previousYear}`);

    for (const transaction of recurringTransactions) {
      const releaseDate = new Date(transaction.release_date);
      const transactionDay = releaseDate.getUTCDate();// Usar UTC para evitar problemas de fuso horário
      const transactionMonth = releaseDate.getUTCMonth() + 1;
      const transactionYear = releaseDate.getUTCFullYear();

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
          if (transaction.number_installments !== null && transaction.number_installments !== undefined) {
            newTransactionData.number_installments = transaction.number_installments;
          }
          if (transaction.current_installment !== null && transaction.current_installment !== undefined) {
            newTransactionData.current_installment = transaction.current_installment;
          }
          const newTransaction = await this.createTransaction(newTransactionData);
          if (!newTransaction) { throw { code: 500, message: "Erro ao criar transação recorrente" } }
          console.log(`[RECORRENTE] Nova transação recorrente criada: ${transaction.name} - R$ ${transaction.value} (do mês ${previousMonth}/${previousYear} para ${currentMonth}/${currentYear})`);
        } else { console.log(`[RECORRENTE] Transação já existe para o mês atual: ${transaction.name}`); }
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

    const today = new Date();
    const currentDay = today.getUTCDate();
    const currentMonth = today.getUTCMonth() + 1;
    const currentYear = today.getUTCFullYear();

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
}

export default TransactionService;