import { jest } from '@jest/globals';
import Decimal from 'decimal.js';

// Mock modules before importing them
const mockGetTransactionsForPDF = jest.fn();
const mockListTransactions = jest.fn();
const mockCountTransactions = jest.fn();
const mockCalculateTotals = jest.fn();
const mockCreateTransaction = jest.fn();
const mockUpdateTransaction = jest.fn();
const mockDeleteTransaction = jest.fn();
const mockGetTransactionById = jest.fn();
const mockGetRecurringTransactions = jest.fn();
const mockGetInstallmentTransactions = jest.fn();
const mockCheckTransactionExistsInPeriod = jest.fn();
const mockCheckInstallmentExistsInMonth = jest.fn();
const mockFindOriginalDayForMonthlyRecurring = jest.fn();
const mockFindOriginalDayForInstallment = jest.fn();
const mockGetFirstInstallmentReleaseDate = jest.fn();
const mockUpdateAccount = jest.fn();
const mockListAccounts = jest.fn();
const mockUpdateAccountBalance = jest.fn();
const mockParse = jest.fn();
const mockAccountSchemaParse = jest.fn();
const mockCheckDailyRecurrence = jest.fn();
const mockCheckWeeklyRecurrence = jest.fn();
const mockCheckMonthlyRecurrence = jest.fn();
const mockCheckYearlyRecurrence = jest.fn();
const mockCalculateDailyNextDate = jest.fn();
const mockCalculateWeeklyNextDate = jest.fn();
const mockCalculateMonthlyNextDate = jest.fn();
const mockCalculateYearlyNextDate = jest.fn();
const mockShouldCreateNextInstallment = jest.fn();
const mockCalculateNextInstallmentDate = jest.fn();

jest.unstable_mockModule('../../repositories/TransactionRepository.js', () => ({
  default: {
    listTransactionsForPDF: mockGetTransactionsForPDF,
    listTransactions: mockListTransactions,
    countTransactions: mockCountTransactions,
    calculateTotals: mockCalculateTotals,
    createTransaction: mockCreateTransaction,
    updateTransaction: mockUpdateTransaction,
    deleteTransaction: mockDeleteTransaction,
    getTransactionById: mockGetTransactionById,
    getRecurringTransactions: mockGetRecurringTransactions,
    getInstallmentTransactions: mockGetInstallmentTransactions,
    checkTransactionExistsInPeriod: mockCheckTransactionExistsInPeriod,
    checkInstallmentExistsInMonth: mockCheckInstallmentExistsInMonth,
    findOriginalDayForMonthlyRecurring: mockFindOriginalDayForMonthlyRecurring,
    findOriginalDayForInstallment: mockFindOriginalDayForInstallment,
    getFirstInstallmentReleaseDate: mockGetFirstInstallmentReleaseDate
  }
}));

jest.unstable_mockModule('../../repositories/AccountRepository.js', () => ({
  default: {
    listAccounts: mockListAccounts,
    updateAccount: mockUpdateAccount,
    updateAccountBalance: mockUpdateAccountBalance
  }
}));

jest.unstable_mockModule('../../schemas/TransactionSchemas.js', () => ({
  default: {
    listTransaction: { parse: mockParse },
    createTransaction: { parse: mockParse },
    transactionIdParam: { parse: mockAccountSchemaParse },
    updateTransaction: { parse: mockParse }
  }
}));

jest.unstable_mockModule('../../schemas/AccountsSchemas.js', () => ({
  default: {
    userIdParam: { parse: mockAccountSchemaParse },
    accountIdParam: { parse: mockAccountSchemaParse }
  }
}));

const { default: TransactionService } = await import('../../services/TransactionService.js');

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactionsForPDF', () => {
    it('deve lançar erro quando parâmetros obrigatórios estiverem faltando', async () => {
      await expect(
        TransactionService.getTransactionsForPDF({})
      ).rejects.toEqual({ code: 400, message: 'Parâmetros obrigatórios: userId, startDate, endDate, type' });
    });

    it('deve chamar repositório com parâmetros corretos', async () => {
      const params = {
        userId: '1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        type: 'income',
        accountId: '2'
      };
      mockGetTransactionsForPDF.mockResolvedValue([]);

      await TransactionService.getTransactionsForPDF(params);

      expect(mockGetTransactionsForPDF).toHaveBeenCalledWith(1, '2024-01-01', '2024-01-31', 'income', '2');
    });

    it('deve converter type "all" para undefined', async () => {
      const params = {
        userId: '1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        type: 'all'
      };
      mockGetTransactionsForPDF.mockResolvedValue([]);

      await TransactionService.getTransactionsForPDF(params);

      expect(mockGetTransactionsForPDF).toHaveBeenCalledWith(1, '2024-01-01', '2024-01-31', undefined, undefined);
    });
  });

  describe('listTransactions', () => {
    it('deve listar transações com valores padrão', async () => {
      mockParse.mockReturnValue({ userId: 1 });
      mockListTransactions.mockResolvedValue([]);
      mockCountTransactions.mockResolvedValue(0);
      mockCalculateTotals.mockResolvedValue({
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0
      });

      const result = await TransactionService.listTransactions({});

      expect(result).toEqual({
        data: {
          transactions: [],
          totalIncome: 0,
          totalExpense: 0,
          netBalance: 0
        },
        total: 0,
        take: 5
      });
    });

    it('deve converter id para inteiro quando presente', async () => {
      mockParse.mockReturnValue({ userId: 1, id: '10', page: 2, limit: 10 });
      mockListTransactions.mockResolvedValue([]);
      mockCountTransactions.mockResolvedValue(0);
      mockCalculateTotals.mockResolvedValue({
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0
      });

      await TransactionService.listTransactions({ id: '10' });

      expect(mockListTransactions).toHaveBeenCalledWith(
        expect.objectContaining({ id: 10, userId: 1 }),
        10,
        10,
        'asc'
      );
    });
  });

  describe('_calculateInstallmentValues', () => {
    it('não deve calcular valores se não houver parcelas', () => {
      const transaction = { value: 100 };
      TransactionService._calculateInstallmentValues(transaction);
      expect(transaction.value_installment).toBeUndefined();
    });

    it('não deve calcular valores se number_installments for 1', () => {
      const transaction = { value: 100, number_installments: 1 };
      TransactionService._calculateInstallmentValues(transaction);
      expect(transaction.value_installment).toBeUndefined();
    });

    it('deve calcular valor da parcela corretamente', () => {
      const transaction = { value: 100, number_installments: 3 };
      TransactionService._calculateInstallmentValues(transaction);
      expect(transaction.value_installment).toBe(33.33);
      expect(transaction.current_installment).toBe(1);
    });

    it('não deve sobrescrever current_installment se já definido', () => {
      const transaction = { value: 100, number_installments: 3, current_installment: 2 };
      TransactionService._calculateInstallmentValues(transaction);
      expect(transaction.current_installment).toBe(2);
    });
  });

  describe('_shouldUpdateAccountBalance', () => {
    it('deve retornar userId para expense com accountId e userId', () => {
      const transaction = { type: 'expense', accountId: 1, userId: 1 };
      expect(TransactionService._shouldUpdateAccountBalance(transaction)).toBeTruthy();
    });

    it('deve retornar userId para income com accountId e userId', () => {
      const transaction = { type: 'income', accountId: 1, userId: 1 };
      expect(TransactionService._shouldUpdateAccountBalance(transaction)).toBeTruthy();
    });

    it('deve retornar falsy se não for expense nem income', () => {
      const transaction = { type: 'transfer', accountId: 1, userId: 1 };
      expect(TransactionService._shouldUpdateAccountBalance(transaction)).toBeFalsy();
    });

    it('deve retornar falsy se não tiver accountId', () => {
      const transaction = { type: 'expense', userId: 1 };
      expect(TransactionService._shouldUpdateAccountBalance(transaction)).toBeFalsy();
    });

    it('deve retornar falsy se não tiver userId', () => {
      const transaction = { type: 'expense', accountId: 1 };
      expect(TransactionService._shouldUpdateAccountBalance(transaction)).toBeFalsy();
    });
  });

  describe('createTransaction', () => {
    it('deve criar transação sem atualizar saldo quando não necessário', async () => {
      mockParse.mockReturnValue({ name: 'Test', type: 'transfer', value: 100 });
      mockCreateTransaction.mockResolvedValue({ id: 1, name: 'Test' });

      const result = await TransactionService.createTransaction({ name: 'Test' });

      expect(result).toEqual({ id: 1, name: 'Test' });
      expect(mockCreateTransaction).toHaveBeenCalled();
    });

    it('deve lançar erro se createTransaction retornar null', async () => {
      mockParse.mockReturnValue({ name: 'Test', type: 'transfer', value: 100 });
      mockCreateTransaction.mockResolvedValue(null);

      await expect(
        TransactionService.createTransaction({ name: 'Test' })
      ).rejects.toEqual({ code: 404 });
    });

    it('deve criar transação com parcelas e atualizar saldo', async () => {
      mockParse.mockReturnValue({
        name: 'Test',
        type: 'expense',
        value: 300,
        number_installments: 3,
        accountId: 1,
        userId: 1
      });
      mockListAccounts.mockResolvedValue([{ id: 1, balance: 1000 }]);
      mockUpdateAccount.mockResolvedValue({ id: 1, balance: 900 });
      mockCreateTransaction.mockResolvedValue({ id: 1, name: 'Test' });

      const result = await TransactionService.createTransaction({
        name: 'Test',
        type: 'expense',
        value: 300,
        number_installments: 3,
        accountId: 1,
        userId: 1
      });

      expect(result).toEqual({ id: 1, name: 'Test' });
      expect(mockUpdateAccount).toHaveBeenCalled();
    });
  });

  describe('updateAccountBalance', () => {
    it('deve adicionar valor ao saldo', async () => {
      mockListAccounts.mockResolvedValue([{ id: 1, balance: 1000 }]);
      mockUpdateAccount.mockResolvedValue({ id: 1, balance: 1500 });

      await TransactionService.updateAccountBalance({
        accountId: 1,
        userId: 1,
        amount: 500,
        operation: 'add'
      });

      expect(mockUpdateAccount).toHaveBeenCalledWith(1, 1, { balance: 1500 });
    });

    it('deve subtrair valor do saldo', async () => {
      mockListAccounts.mockResolvedValue([{ id: 1, balance: 1000 }]);
      mockUpdateAccount.mockResolvedValue({ id: 1, balance: 700 });

      await TransactionService.updateAccountBalance({
        accountId: 1,
        userId: 1,
        amount: 300,
        operation: 'subtract'
      });

      expect(mockUpdateAccount).toHaveBeenCalledWith(1, 1, { balance: 700 });
    });
  });

  describe('updateTransaction', () => {
    it('deve lançar erro se transação não for encontrada', async () => {
      mockAccountSchemaParse.mockReturnValue({ id: 1, userId: 1 });
      mockParse.mockReturnValue({ name: 'Updated' });
      mockListTransactions.mockResolvedValue([]);

      await expect(
        TransactionService.updateTransaction(1, 1, { name: 'Updated' })
      ).rejects.toEqual({ code: 404, message: 'Transação não encontrada' });
    });

    it('deve filtrar valores vazios', async () => {
      mockAccountSchemaParse.mockReturnValue({ id: 1, userId: 1 });
      mockParse.mockReturnValue({ name: 'Updated', description: '', value: null });
      mockListTransactions.mockResolvedValue([{
        id: 1,
        name: 'Old',
        type: 'transfer',
        value: 100
      }]);
      mockUpdateTransaction.mockResolvedValue({ id: 1, name: 'Updated' });

      await TransactionService.updateTransaction(1, 1, { name: 'Updated', description: '', value: null });

      expect(mockUpdateTransaction).toHaveBeenCalledWith(1, { name: 'Updated' });
    });

    it('deve atualizar saldo quando valor mudar em transação income', async () => {
      mockAccountSchemaParse.mockReturnValue({ id: 1, userId: 1 });
      mockParse.mockReturnValue({ value: 200 });
      mockListTransactions.mockResolvedValue([{
        id: 1,
        type: 'income',
        value: 100,
        accountId: 1
      }]);
      mockListAccounts.mockResolvedValue([{ id: 1, balance: 1000 }]);
      mockUpdateAccount.mockResolvedValue({ id: 1, balance: 1100 });
      mockUpdateTransaction.mockResolvedValue({ id: 1, value: 200 });

      await TransactionService.updateTransaction(1, 1, { value: 200 });

      expect(mockUpdateAccount).toHaveBeenCalledTimes(2); // Reverte e aplica novo valor
    });

    it('deve lançar erro se updateTransaction retornar null', async () => {
      mockAccountSchemaParse.mockReturnValue({ id: 1, userId: 1 });
      mockParse.mockReturnValue({ name: 'Updated' });
      mockListTransactions.mockResolvedValue([{
        id: 1,
        type: 'transfer',
        value: 100
      }]);
      mockUpdateTransaction.mockResolvedValue(null);

      await expect(
        TransactionService.updateTransaction(1, 1, { name: 'Updated' })
      ).rejects.toEqual({ code: 404 });
    });
  });

  describe('deleteTransaction', () => {
    it('deve lançar erro se transação não for encontrada', async () => {
      mockAccountSchemaParse.mockReturnValue({ id: 1, userId: 1 });
      mockListTransactions.mockResolvedValue([]);

      await expect(
        TransactionService.deleteTransaction(1, 1)
      ).rejects.toEqual({ code: 404, message: 'Transação não encontrada' });
    });

    it('deve deletar transação sem reverter saldo quando não necessário', async () => {
      mockAccountSchemaParse.mockReturnValue({ id: 1, userId: 1 });
      mockListTransactions.mockResolvedValue([{
        id: 1,
        type: 'transfer',
        value: 100
      }]);
      mockDeleteTransaction.mockResolvedValue({ success: true });

      const result = await TransactionService.deleteTransaction(1, 1);

      expect(result).toEqual({ success: true });
      expect(mockUpdateAccount).not.toHaveBeenCalled();
    });

    it('deve reverter saldo ao deletar transação expense', async () => {
      mockAccountSchemaParse.mockReturnValue({ id: 1, userId: 1 });
      mockListTransactions.mockResolvedValue([{
        id: 1,
        type: 'expense',
        value: 100,
        accountId: 1
      }]);
      mockListAccounts.mockResolvedValue([{ id: 1, balance: 900 }]);
      mockUpdateAccount.mockResolvedValue({ id: 1, balance: 1000 });
      mockDeleteTransaction.mockResolvedValue({ success: true });

      await TransactionService.deleteTransaction(1, 1);

      expect(mockUpdateAccount).toHaveBeenCalledWith(1, 1, { balance: 1000 });
    });

    it('deve reverter saldo ao deletar transação income', async () => {
      mockAccountSchemaParse.mockReturnValue({ id: 1, userId: 1 });
      mockListTransactions.mockResolvedValue([{
        id: 1,
        type: 'income',
        value: 100,
        accountId: 1
      }]);
      mockListAccounts.mockResolvedValue([{ id: 1, balance: 1100 }]);
      mockUpdateAccount.mockResolvedValue({ id: 1, balance: 1000 });
      mockDeleteTransaction.mockResolvedValue({ success: true });

      await TransactionService.deleteTransaction(1, 1);

      expect(mockUpdateAccount).toHaveBeenCalledWith(1, 1, { balance: 1000 });
    });

    it('deve usar value_installment quando disponível', async () => {
      mockAccountSchemaParse.mockReturnValue({ id: 1, userId: 1 });
      mockListTransactions.mockResolvedValue([{
        id: 1,
        type: 'expense',
        value: 300,
        value_installment: 100,
        accountId: 1
      }]);
      mockListAccounts.mockResolvedValue([{ id: 1, balance: 900 }]);
      mockUpdateAccount.mockResolvedValue({ id: 1, balance: 1000 });
      mockDeleteTransaction.mockResolvedValue({ success: true });

      await TransactionService.deleteTransaction(1, 1);

      expect(mockUpdateAccount).toHaveBeenCalledWith(1, 1, { balance: 1000 });
    });
  });

  describe('_calculateDailyNextDate', () => {
    it('deve calcular data do dia seguinte', () => {
      const currentDate = new Date('2024-01-15T00:00:00.000Z');
      const result = TransactionService._calculateDailyNextDate({}, currentDate);
      expect(result).toBe('2024-01-15');
    });
  });

  describe('_calculateWeeklyNextDate', () => {
    it('deve calcular data da próxima semana', () => {
      const currentDate = new Date('2024-01-15T00:00:00.000Z');
      const result = TransactionService._calculateWeeklyNextDate({}, currentDate);
      expect(result).toBe('2024-01-15');
    });
  });

  describe('_calculateYearlyNextDate', () => {
    it('deve calcular data do próximo ano', () => {
      const transaction = { release_date: '2023-05-20' };
      const currentDate = new Date('2024-05-20T00:00:00.000Z');
      const result = TransactionService._calculateYearlyNextDate(transaction, currentDate);
      expect(result).toBe('2024-05-20');
    });
  });

  describe('_checkDailyRecurrence', () => {
    it('deve retornar true se transação for de ontem', async () => {
      const transaction = { release_date: '2024-01-14' };
      const currentDate = new Date('2024-01-15T00:00:00.000Z');
      const result = await TransactionService._checkDailyRecurrence(transaction, currentDate);
      expect(result).toBe(true);
    });

    it('deve retornar false se transação não for de ontem', async () => {
      const transaction = { release_date: '2024-01-10' };
      const currentDate = new Date('2024-01-15T00:00:00.000Z');
      const result = await TransactionService._checkDailyRecurrence(transaction, currentDate);
      expect(result).toBe(false);
    });
  });

  describe('_checkWeeklyRecurrence', () => {
    it('deve retornar true se transação for de 7 dias atrás', async () => {
      const transaction = { release_date: '2024-01-08' };
      const currentDate = new Date('2024-01-15T00:00:00.000Z');
      const result = await TransactionService._checkWeeklyRecurrence(transaction, currentDate);
      expect(result).toBe(true);
    });

    it('deve retornar false se transação não for de 7 dias atrás', async () => {
      const transaction = { release_date: '2024-01-10' };
      const currentDate = new Date('2024-01-15T00:00:00.000Z');
      const result = await TransactionService._checkWeeklyRecurrence(transaction, currentDate);
      expect(result).toBe(false);
    });
  });

  describe('_checkYearlyRecurrence', () => {
    it('deve retornar true se for mesmo dia e mês do ano anterior', async () => {
      const transaction = { release_date: '2023-05-20' };
      const currentDate = new Date('2024-05-20T00:00:00.000Z');
      const result = await TransactionService._checkYearlyRecurrence(transaction, currentDate);
      expect(result).toBe(true);
    });

    it('deve retornar false se não for mesmo dia e mês do ano anterior', async () => {
      const transaction = { release_date: '2023-05-20' };
      const currentDate = new Date('2024-05-21T00:00:00.000Z');
      const result = await TransactionService._checkYearlyRecurrence(transaction, currentDate);
      expect(result).toBe(false);
    });
  });

  describe('processRecurringTransactions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('não deve processar se não houver transações', async () => {
      mockGetRecurringTransactions.mockResolvedValue([]);
      await TransactionService.processRecurringTransactions();
      expect(mockCreateTransaction).not.toHaveBeenCalled();
    });

    it('não deve processar se retornar null', async () => {
      mockGetRecurringTransactions.mockResolvedValue(null);
      await TransactionService.processRecurringTransactions();
      expect(mockCreateTransaction).not.toHaveBeenCalled();
    });

    it('deve tratar tipo de recorrência desconhecido', async () => {
      mockGetRecurringTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Test Unknown',
          recurring_type: 'unknown',
          type: 'expense',
          category: 'test',
          value: new Decimal(100),
          release_date: '2024-01-15',
          accountId: 1,
          paymentMethodId: 1,
          userId: 1
        }
      ]);

      await TransactionService.processRecurringTransactions();

      expect(mockCheckTransactionExistsInPeriod).not.toHaveBeenCalled();
    });
  });

  describe('processInstallmentsTransactions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('não deve processar se não houver parcelas', async () => {
      mockGetInstallmentTransactions.mockResolvedValue([]);
      await TransactionService.processInstallmentsTransactions();
      expect(mockCreateTransaction).not.toHaveBeenCalled();
    });

    it('não deve processar se retornar null', async () => {
      mockGetInstallmentTransactions.mockResolvedValue(null);
      await TransactionService.processInstallmentsTransactions();
      expect(mockCreateTransaction).not.toHaveBeenCalled();
    });

    it('não deve processar parcela se já estiver completa', async () => {
      mockGetInstallmentTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Test Complete',
          type: 'expense',
          category: 'test',
          value: new Decimal(300),
          number_installments: 3,
          current_installment: 3,
          value_installment: new Decimal(100),
          release_date: '2024-01-15',
          accountId: 1,
          paymentMethodId: 1,
          userId: 1
        }
      ]);

      await TransactionService.processInstallmentsTransactions();

      expect(mockCreateTransaction).not.toHaveBeenCalled();
    });

    it('não deve processar parcela se não for do mês anterior', async () => {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      const twoMonthsAgoStr = twoMonthsAgo.toISOString().split('T')[0];

      mockGetInstallmentTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Test Old Installment',
          type: 'expense',
          category: 'test',
          value: new Decimal(300),
          number_installments: 3,
          current_installment: 1,
          value_installment: new Decimal(100),
          release_date: twoMonthsAgoStr,
          accountId: 1,
          paymentMethodId: 1,
          userId: 1
        }
      ]);

      await TransactionService.processInstallmentsTransactions();

      expect(mockCreateTransaction).not.toHaveBeenCalled();
    });

    it('deve processar parcela intermediária com valor padrão', async () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      lastMonth.setDate(15);
      const lastMonthStr = lastMonth.toISOString().split('T')[0];

      const currentDate = new Date();
      currentDate.setDate(15);

      mockGetInstallmentTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Parcela Teste',
          type: 'expense',
          category: 'test',
          value: new Decimal(300),
          number_installments: 3,
          current_installment: 1,
          value_installment: new Decimal(100),
          release_date: lastMonthStr,
          accountId: 1,
          paymentMethodId: 1,
          userId: 1
        }
      ]);

      const mockShouldCreate = jest.spyOn(TransactionService, '_shouldCreateNextInstallment');
      mockShouldCreate.mockResolvedValue(true);

      const mockCalculateDate = jest.spyOn(TransactionService, '_calculateNextInstallmentDate');
      mockCalculateDate.mockResolvedValue('2024-03-15');

      mockCheckInstallmentExistsInMonth.mockResolvedValue(false);
      mockParse.mockReturnValue({
        type: 'expense',
        name: 'Parcela Teste',
        category: 'test',
        value: 300,
        value_installment: 100,
        release_date: '2024-03-15',
        number_installments: 3,
        current_installment: 2,
        recurring: false,
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
      });
      mockCreateTransaction.mockResolvedValue({ id: 2, current_installment: 2 });
      mockListAccounts.mockResolvedValue([{ id: 1, balance: 1000 }]);
      mockUpdateAccount.mockResolvedValue({ id: 1, balance: 900 });

      await TransactionService.processInstallmentsTransactions();

      expect(mockCreateTransaction).toHaveBeenCalled();

      mockShouldCreate.mockRestore();
      mockCalculateDate.mockRestore();
    });

    it('deve processar última parcela com ajuste de valor', async () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      lastMonth.setDate(15);
      const lastMonthStr = lastMonth.toISOString().split('T')[0];

      mockGetInstallmentTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Última Parcela',
          type: 'expense',
          category: 'test',
          value: new Decimal(100),
          number_installments: 3,
          current_installment: 2,
          value_installment: new Decimal(33.33),
          release_date: lastMonthStr,
          accountId: 1,
          paymentMethodId: 1,
          userId: 1
        }
      ]);

      const mockShouldCreate = jest.spyOn(TransactionService, '_shouldCreateNextInstallment');
      mockShouldCreate.mockResolvedValue(true);

      const mockCalculateDate = jest.spyOn(TransactionService, '_calculateNextInstallmentDate');
      mockCalculateDate.mockResolvedValue('2024-03-15');

      mockCheckInstallmentExistsInMonth.mockResolvedValue(false);
      mockParse.mockReturnValue({
        type: 'expense',
        name: 'Última Parcela',
        category: 'test',
        value: 100,
        value_installment: 33.34, // Valor ajustado
        release_date: '2024-03-15',
        number_installments: 3,
        current_installment: 3,
        recurring: false,
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
      });
      mockCreateTransaction.mockResolvedValue({ id: 2, current_installment: 3 });
      mockListAccounts.mockResolvedValue([{ id: 1, balance: 1000 }]);
      mockUpdateAccount.mockResolvedValue({ id: 1, balance: 966.66 });

      await TransactionService.processInstallmentsTransactions();

      expect(mockCreateTransaction).toHaveBeenCalled();

      mockShouldCreate.mockRestore();
      mockCalculateDate.mockRestore();
    });

    it('não deve criar parcela se já existe no mês atual', async () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      lastMonth.setDate(15);
      const lastMonthStr = lastMonth.toISOString().split('T')[0];

      mockGetInstallmentTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Parcela Existente',
          type: 'expense',
          category: 'test',
          value: new Decimal(300),
          number_installments: 3,
          current_installment: 1,
          value_installment: new Decimal(100),
          release_date: lastMonthStr,
          accountId: 1,
          paymentMethodId: 1,
          userId: 1
        }
      ]);

      const mockShouldCreate = jest.spyOn(TransactionService, '_shouldCreateNextInstallment');
      mockShouldCreate.mockResolvedValue(true);

      const mockCalculateDate = jest.spyOn(TransactionService, '_calculateNextInstallmentDate');
      mockCalculateDate.mockResolvedValue('2024-03-15');

      mockCheckInstallmentExistsInMonth.mockResolvedValue(true);

      await TransactionService.processInstallmentsTransactions();

      expect(mockCreateTransaction).not.toHaveBeenCalled();

      mockShouldCreate.mockRestore();
      mockCalculateDate.mockRestore();
    });

    it('não deve criar parcela que excederia o máximo', async () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      lastMonth.setDate(15);
      const lastMonthStr = lastMonth.toISOString().split('T')[0];

      mockGetInstallmentTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Parcela Limite',
          type: 'expense',
          category: 'test',
          value: new Decimal(300),
          number_installments: 3,
          current_installment: 3,
          value_installment: new Decimal(100),
          release_date: lastMonthStr,
          accountId: 1,
          paymentMethodId: 1,
          userId: 1
        }
      ]);

      const mockShouldCreate = jest.spyOn(TransactionService, '_shouldCreateNextInstallment');
      mockShouldCreate.mockResolvedValue(true);

      await TransactionService.processInstallmentsTransactions();

      expect(mockCreateTransaction).not.toHaveBeenCalled();

      mockShouldCreate.mockRestore();
    });
  });

  describe('_checkMonthlyRecurrence', () => {
    it('deve retornar false se transação não for do mês anterior', async () => {
      const transaction = {
        release_date: new Date(2024, 0, 15).toISOString()
      };
      const currentDate = new Date(2024, 2, 15); // Março

      const result = await TransactionService._checkMonthlyRecurrence(transaction, currentDate);
      expect(result).toBe(false);
    });

    it('deve retornar true quando dia original existe no mês atual', async () => {
      // Transação do mês anterior, dia 15
      const transaction = {
        release_date: new Date(Date.UTC(2024, 1, 15)).toISOString(), // 15 de fevereiro
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1
      };

      // Data atual: 15 de março
      const currentDate = new Date(Date.UTC(2024, 2, 15));

      // Mock para retornar o dia 15 como original
      const mockFindOriginal = jest.spyOn(TransactionService, '_findOriginalDayForMonthlyRecurring');
      mockFindOriginal.mockResolvedValue(15);

      const result = await TransactionService._checkMonthlyRecurrence(transaction, currentDate);
      expect(result).toBe(true);

      mockFindOriginal.mockRestore();
    });

    it('deve verificar último dia do mês quando dia original não existe', async () => {
      // Transação de 31 de janeiro
      const transaction = {
        release_date: new Date(Date.UTC(2024, 0, 31)).toISOString(),
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1
      };

      // Data atual: 29 de fevereiro de 2024 (ano bissexto)
      const feb29 = new Date(Date.UTC(2024, 1, 29));

      const mockFindOriginal = jest.spyOn(TransactionService, '_findOriginalDayForMonthlyRecurring');
      mockFindOriginal.mockResolvedValue(31);

      const result = await TransactionService._checkMonthlyRecurrence(transaction, feb29);
      expect(result).toBe(true);

      mockFindOriginal.mockRestore();
    });
  });

  describe('_calculateMonthlyNextDate', () => {
    it('deve calcular próxima data mensal com dia original', async () => {
      const currentDate = new Date(2024, 2, 15); // 15 de março
      const transaction = {
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1
      };

      const mockFindOriginal = jest.spyOn(TransactionService, '_findOriginalDayForMonthlyRecurring');
      mockFindOriginal.mockResolvedValue(15);

      const result = await TransactionService._calculateMonthlyNextDate(transaction, currentDate);
      expect(result).toMatch(/2024-03-15/);

      mockFindOriginal.mockRestore();
    });

    it('deve usar último dia do mês quando dia original não existe', async () => {
      const feb15 = new Date(2024, 1, 15); // Fevereiro
      const transaction = {
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1
      };

      const mockFindOriginal = jest.spyOn(TransactionService, '_findOriginalDayForMonthlyRecurring');
      mockFindOriginal.mockResolvedValue(31);

      const result = await TransactionService._calculateMonthlyNextDate(transaction, feb15);
      expect(result).toMatch(/2024-02-29/); // 2024 é bissexto

      mockFindOriginal.mockRestore();
    });
  });

  describe('_calculateYearlyNextDate', () => {
    it('deve calcular próxima data anual', () => {
      const transaction = {
        release_date: new Date(2023, 5, 15).toISOString()
      };
      const currentDate = new Date(2024, 5, 15);

      const result = TransactionService._calculateYearlyNextDate(transaction, currentDate);
      expect(result).toBe('2024-06-15');
    });
  });

  describe('_shouldCreateNextInstallment', () => {
    it('deve retornar false se transação não for do mês anterior', async () => {
      const transaction = {
        release_date: new Date(2024, 0, 15).toISOString(),
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1,
        number_installments: 3
      };
      const currentDate = new Date(2024, 2, 15); // Março (transação em janeiro)

      const result = await TransactionService._shouldCreateNextInstallment(transaction, currentDate);
      expect(result).toBe(false);
    });

    it('deve retornar true quando é o dia correto da parcela', async () => {
      // Transação do mês anterior, dia 15
      const transaction = {
        release_date: new Date(Date.UTC(2024, 1, 15)).toISOString(), // 15 de fevereiro
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1,
        number_installments: 3,
        current_installment: 1
      };

      // Data atual: 15 de março
      const currentDate = new Date(Date.UTC(2024, 2, 15));

      const mockFindOriginal = jest.spyOn(TransactionService, '_findOriginalDayForInstallment');
      mockFindOriginal.mockResolvedValue(15);

      const result = await TransactionService._shouldCreateNextInstallment(transaction, currentDate);
      expect(result).toBe(true);

      mockFindOriginal.mockRestore();
    });

    it('deve verificar último dia quando dia original não existe no mês', async () => {
      const lastMonth = new Date(2024, 0, 31); // 31 de janeiro
      const feb29 = new Date(2024, 1, 29); // 29 de fevereiro (ano bissexto)

      const transaction = {
        release_date: lastMonth.toISOString(),
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1,
        number_installments: 3,
        current_installment: 1
      };

      const mockFindOriginal = jest.spyOn(TransactionService, '_findOriginalDayForInstallment');
      mockFindOriginal.mockResolvedValue(31);

      const result = await TransactionService._shouldCreateNextInstallment(transaction, feb29);
      expect(result).toBe(true); // 29 é o último dia de fevereiro 2024

      mockFindOriginal.mockRestore();
    });
  });

  describe('_calculateNextInstallmentDate', () => {
    it('deve calcular próxima data de parcela com dia original', async () => {
      const currentDate = new Date(2024, 2, 15);
      const transaction = {
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1,
        number_installments: 3,
        current_installment: 1
      };

      const mockFindOriginal = jest.spyOn(TransactionService, '_findOriginalDayForInstallment');
      mockFindOriginal.mockResolvedValue(15);

      const result = await TransactionService._calculateNextInstallmentDate(transaction, currentDate);
      expect(result).toBe('2024-03-15');

      mockFindOriginal.mockRestore();
    });

    it('deve usar último dia do mês quando dia original não existe', async () => {
      const feb15 = new Date(2024, 1, 15);
      const transaction = {
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1,
        number_installments: 3,
        current_installment: 1
      };

      const mockFindOriginal = jest.spyOn(TransactionService, '_findOriginalDayForInstallment');
      mockFindOriginal.mockResolvedValue(31);

      const result = await TransactionService._calculateNextInstallmentDate(transaction, feb15);
      expect(result).toBe('2024-02-29'); // 2024 é bissexto

      mockFindOriginal.mockRestore();
    });
  });

  describe('processRecurringTransactions - Cobertura Completa', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('deve processar recorrência diária e criar nova transação', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      mockGetRecurringTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Daily Expense',
          recurring_type: 'daily',
          type: 'expense',
          category: 'Food',
          value: 50,
          release_date: yesterdayStr,
          accountId: 1,
          paymentMethodId: 1,
          userId: 1,
          recurring: true
        }
      ]);

      // Mockar os métodos privados para garantir que o fluxo funcione
      const spy = jest.spyOn(TransactionService, '_checkDailyRecurrence').mockResolvedValue(true);
      const spyCalc = jest.spyOn(TransactionService, '_calculateDailyNextDate').mockReturnValue(todayStr);
      const spyCreate = jest.spyOn(TransactionService, '_createRecurringTransaction').mockResolvedValue({ id: 2 });

      await TransactionService.processRecurringTransactions();

      expect(spy).toHaveBeenCalled();
      expect(spyCalc).toHaveBeenCalled();
      expect(spyCreate).toHaveBeenCalled();
      
      spy.mockRestore();
      spyCalc.mockRestore();
      spyCreate.mockRestore();
    });

    it('deve processar recorrência semanal e criar nova transação', async () => {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastWeekStr = lastWeek.toISOString().split('T')[0];
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      mockGetRecurringTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Weekly Expense',
          recurring_type: 'weekly',
          type: 'expense',
          category: 'Transport',
          value: 100,
          release_date: lastWeekStr,
          accountId: 1,
          paymentMethodId: 1,
          userId: 1,
          recurring: true
        }
      ]);

      // Mockar os métodos privados para garantir que o fluxo funcione
      const spy = jest.spyOn(TransactionService, '_checkWeeklyRecurrence').mockResolvedValue(true);
      const spyCalc = jest.spyOn(TransactionService, '_calculateWeeklyNextDate').mockReturnValue(todayStr);
      const spyCreate = jest.spyOn(TransactionService, '_createRecurringTransaction').mockResolvedValue({ id: 2 });

      await TransactionService.processRecurringTransactions();

      expect(spy).toHaveBeenCalled();
      expect(spyCalc).toHaveBeenCalled();
      expect(spyCreate).toHaveBeenCalled();
      
      spy.mockRestore();
      spyCalc.mockRestore();
      spyCreate.mockRestore();
    });

    it('deve processar recorrência anual e criar nova transação', async () => {
      const today = new Date();
      const lastYear = new Date(today);
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      const lastYearStr = lastYear.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];

      mockGetRecurringTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Yearly Subscription',
          recurring_type: 'yearly',
          type: 'expense',
          category: 'Services',
          value: 1200,
          release_date: lastYearStr,
          accountId: 1,
          paymentMethodId: 1,
          userId: 1,
          recurring: true
        }
      ]);

      // Mockar os métodos privados para garantir que o fluxo funcione
      const spy = jest.spyOn(TransactionService, '_checkYearlyRecurrence').mockResolvedValue(true);
      const spyCalc = jest.spyOn(TransactionService, '_calculateYearlyNextDate').mockReturnValue(todayStr);
      const spyCreate = jest.spyOn(TransactionService, '_createRecurringTransaction').mockResolvedValue({ id: 2 });

      await TransactionService.processRecurringTransactions();

      expect(spy).toHaveBeenCalled();
      expect(spyCalc).toHaveBeenCalled();
      expect(spyCreate).toHaveBeenCalled();
      
      spy.mockRestore();
      spyCalc.mockRestore();
      spyCreate.mockRestore();
    });

    it('deve lançar erro quando createTransaction falha na recorrência', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      mockGetRecurringTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Daily Test',
          recurring_type: 'daily',
          type: 'expense',
          category: 'Test',
          value: 50,
          release_date: yesterdayStr,
          accountId: 1,
          paymentMethodId: 1,
          userId: 1,
          recurring: true
        }
      ]);

      // Mockar os métodos privados para garantir que o fluxo funcione até o erro
      const spy = jest.spyOn(TransactionService, '_checkDailyRecurrence').mockResolvedValue(true);
      const spyCalc = jest.spyOn(TransactionService, '_calculateDailyNextDate').mockReturnValue(todayStr);
      const spyCreate = jest.spyOn(TransactionService, '_createRecurringTransaction').mockRejectedValue(new Error('Falha ao criar transação'));

      await expect(TransactionService.processRecurringTransactions()).rejects.toEqual({
        code: 500,
        message: expect.stringContaining('Erro ao processar transação recorrente')
      });
      
      spy.mockRestore();
      spyCalc.mockRestore();
      spyCreate.mockRestore();
    });
  });

  describe('_createRecurringTransaction - Cobertura Completa', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('deve criar transação recorrente diária quando não existe no período', async () => {
      const transaction = {
        id: 1,
        name: 'Daily Transaction',
        type: 'expense',
        category: 'Food',
        value: 50,
        release_date: '2024-01-15',
        recurring: true,
        recurring_type: 'daily',
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
      };

      mockCheckTransactionExistsInPeriod.mockResolvedValue(false);
      mockParse.mockReturnValue({
        ...transaction,
        release_date: '2024-01-16'
      });
      mockCreateTransaction.mockResolvedValue({ id: 2 });

      await TransactionService._createRecurringTransaction(transaction, '2024-01-16', 'daily');

      expect(mockCheckTransactionExistsInPeriod).toHaveBeenCalled();
      expect(mockCreateTransaction).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Daily Transaction',
        recurring_type: 'daily'
      }));
    });

    it('deve criar transação recorrente semanal quando não existe no período', async () => {
      const transaction = {
        id: 1,
        name: 'Weekly Transaction',
        type: 'income',
        category: 'Salary',
        value: 1000,
        release_date: '2024-01-08',
        recurring: true,
        recurring_type: 'weekly',
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
      };

      mockCheckTransactionExistsInPeriod.mockResolvedValue(false);
      mockParse.mockReturnValue({
        ...transaction,
        release_date: '2024-01-15'
      });
      mockCreateTransaction.mockResolvedValue({ id: 2 });

      await TransactionService._createRecurringTransaction(transaction, '2024-01-15', 'weekly');

      expect(mockCheckTransactionExistsInPeriod).toHaveBeenCalled();
      expect(mockCreateTransaction).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Weekly Transaction',
        recurring_type: 'weekly'
      }));
    });

    it('deve criar transação recorrente mensal quando não existe no período', async () => {
      const transaction = {
        id: 1,
        name: 'Monthly Transaction',
        type: 'expense',
        category: 'Rent',
        value: 2000,
        release_date: '2024-01-10',
        recurring: true,
        recurring_type: 'monthly',
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
      };

      mockCheckTransactionExistsInPeriod.mockResolvedValue(false);
      mockParse.mockReturnValue({
        ...transaction,
        release_date: '2024-02-10'
      });
      mockCreateTransaction.mockResolvedValue({ id: 2 });

      await TransactionService._createRecurringTransaction(transaction, '2024-02-10', 'monthly');

      expect(mockCheckTransactionExistsInPeriod).toHaveBeenCalled();
      expect(mockCreateTransaction).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Monthly Transaction',
        recurring_type: 'monthly'
      }));
    });

    it('deve criar transação recorrente anual quando não existe no período', async () => {
      const transaction = {
        id: 1,
        name: 'Yearly Subscription',
        type: 'expense',
        category: 'Services',
        value: 1200,
        release_date: '2023-05-20',
        recurring: true,
        recurring_type: 'yearly',
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
      };

      mockCheckTransactionExistsInPeriod.mockResolvedValue(false);
      mockParse.mockReturnValue({
        ...transaction,
        release_date: '2024-05-20'
      });
      mockCreateTransaction.mockResolvedValue({ id: 2 });

      await TransactionService._createRecurringTransaction(transaction, '2024-05-20', 'yearly');

      expect(mockCheckTransactionExistsInPeriod).toHaveBeenCalled();
      expect(mockCreateTransaction).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Yearly Subscription',
        recurring_type: 'yearly'
      }));
    });

    it('não deve criar transação quando já existe no período', async () => {
      const transaction = {
        id: 1,
        name: 'Monthly Transaction',
        type: 'expense',
        category: 'Rent',
        value: 2000,
        release_date: '2024-01-10',
        recurring: true,
        recurring_type: 'monthly',
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
      };

      mockCheckTransactionExistsInPeriod.mockResolvedValue(true);

      await TransactionService._createRecurringTransaction(transaction, '2024-02-10', 'monthly');

      expect(mockCheckTransactionExistsInPeriod).toHaveBeenCalled();
      expect(mockCreateTransaction).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando createTransaction retorna null', async () => {
      const transaction = {
        id: 1,
        name: 'Test Transaction',
        type: 'expense',
        category: 'Test',
        value: 100,
        release_date: '2024-01-10',
        recurring: true,
        recurring_type: 'monthly',
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
      };

      mockCheckTransactionExistsInPeriod.mockResolvedValue(false);
      mockParse.mockReturnValue({
        ...transaction,
        release_date: '2024-02-10'
      });
      mockCreateTransaction.mockResolvedValue(null);

      await expect(
        TransactionService._createRecurringTransaction(transaction, '2024-02-10', 'monthly')
      ).rejects.toEqual({ code: 404 });
    });

    it('deve lançar erro para tipo de recorrência não suportado', async () => {
      const transaction = {
        id: 1,
        name: 'Test Transaction',
        type: 'expense',
        category: 'Test',
        value: 100,
        release_date: '2024-01-10',
        recurring: true,
        recurring_type: 'invalid',
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
      };

      await expect(
        TransactionService._createRecurringTransaction(transaction, '2024-02-10', 'invalid')
      ).rejects.toThrow('Tipo de recorrência não suportado: invalid');
    });

    it('deve retornar quando data é inválida', async () => {
      const transaction = {
        id: 1,
        name: 'Test Transaction',
        type: 'expense',
        category: 'Test',
        value: 100,
        release_date: '2024-01-10',
        recurring: true,
        recurring_type: 'monthly',
        accountId: 1,
        paymentMethodId: 1,
        userId: 1
      };

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await TransactionService._createRecurringTransaction(transaction, 'invalid-date', 'monthly');

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[RECORRENTE] Data inválida'));
      expect(mockCreateTransaction).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('deve incluir number_installments quando presente na transação original', async () => {
      const transaction = {
        id: 1,
        name: 'Monthly Transaction',
        type: 'expense',
        category: 'Rent',
        value: 2000,
        release_date: '2024-01-10',
        recurring: true,
        recurring_type: 'monthly',
        accountId: 1,
        paymentMethodId: 1,
        userId: 1,
        number_installments: 12,
        current_installment: 1
      };

      mockCheckTransactionExistsInPeriod.mockResolvedValue(false);
      mockParse.mockReturnValue({
        ...transaction,
        release_date: '2024-02-10'
      });
      mockCreateTransaction.mockResolvedValue({ id: 2 });

      await TransactionService._createRecurringTransaction(transaction, '2024-02-10', 'monthly');

      expect(mockCreateTransaction).toHaveBeenCalledWith(expect.objectContaining({
        number_installments: 12,
        current_installment: 1
      }));
    });
  });

  describe('processInstallmentsTransactions - Cobertura Completa', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('deve processar parcela com description', async () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthStr = lastMonth.toISOString().split('T')[0];
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      mockGetInstallmentTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Installment Transaction',
          type: 'expense',
          category: 'Purchase',
          value: 300,
          value_installment: 100,
          release_date: lastMonthStr,
          number_installments: 3,
          current_installment: 1,
          description: 'Test Description',
          accountId: 1,
          paymentMethodId: 1,
          userId: 1
        }
      ]);

      // Mockar os métodos privados
      const spyShouldCreate = jest.spyOn(TransactionService, '_shouldCreateNextInstallment').mockResolvedValue(true);
      const spyCalcDate = jest.spyOn(TransactionService, '_calculateNextInstallmentDate').mockResolvedValue(todayStr);
      mockCheckInstallmentExistsInMonth.mockResolvedValue(false);
      
      // Espiar no método createTransaction real
      const spyCreate = jest.spyOn(TransactionService, 'createTransaction').mockResolvedValue({ id: 2 });

      await TransactionService.processInstallmentsTransactions();

      expect(spyShouldCreate).toHaveBeenCalled();
      expect(spyCreate).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description'
      }));
      
      spyShouldCreate.mockRestore();
      spyCalcDate.mockRestore();
      spyCreate.mockRestore();
    });

    it('deve lançar erro quando createTransaction falha no processamento de parcelas', async () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthStr = lastMonth.toISOString().split('T')[0];
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      mockGetInstallmentTransactions.mockResolvedValue([
        {
          id: 1,
          name: 'Installment Transaction',
          type: 'expense',
          category: 'Purchase',
          value: 300,
          value_installment: 100,
          release_date: lastMonthStr,
          number_installments: 3,
          current_installment: 1,
          accountId: 1,
          paymentMethodId: 1,
          userId: 1
        }
      ]);

      // Mockar os métodos privados para forçar o erro
      const spyShouldCreate = jest.spyOn(TransactionService, '_shouldCreateNextInstallment').mockResolvedValue(true);
      const spyCalcDate = jest.spyOn(TransactionService, '_calculateNextInstallmentDate').mockResolvedValue(todayStr);
      mockCheckInstallmentExistsInMonth.mockResolvedValue(false);
      
      // Espiar no método createTransaction e fazer lançar erro
      const spyCreate = jest.spyOn(TransactionService, 'createTransaction').mockRejectedValue(new Error('Falha ao criar transação'));

      await expect(TransactionService.processInstallmentsTransactions()).rejects.toEqual({
        code: 500,
        message: expect.stringContaining('Erro ao processar parcela')
      });
      
      spyShouldCreate.mockRestore();
      spyCalcDate.mockRestore();
      spyCreate.mockRestore();
    });
  });

  describe('_findOriginalDayForInstallment - Cobertura Completa', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('deve retornar dia original quando encontrar primeira parcela', async () => {
      const transaction = {
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1,
        number_installments: 3,
        release_date: '2024-02-15'
      };

      mockGetFirstInstallmentReleaseDate.mockResolvedValue('2024-01-31');

      const result = await TransactionService._findOriginalDayForInstallment(transaction);

      expect(result).toBe(31);
      expect(mockGetFirstInstallmentReleaseDate).toHaveBeenCalledWith({
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1,
        number_installments: 3
      });
    });

    it('deve usar dia da transação atual quando não encontrar primeira parcela', async () => {
      const transaction = {
        userId: 1,
        name: 'Test',
        category: 'Test',
        type: 'expense',
        accountId: 1,
        paymentMethodId: 1,
        number_installments: 3,
        release_date: '2024-02-15'
      };

      mockGetFirstInstallmentReleaseDate.mockResolvedValue(null);

      const result = await TransactionService._findOriginalDayForInstallment(transaction);

      expect(result).toBe(15);
    });
  });
});
