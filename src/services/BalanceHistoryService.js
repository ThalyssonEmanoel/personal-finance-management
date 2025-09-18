import BalanceHistoryRepository from '../repositories/BalanceHistoryRepository.js';
import BalanceHistorySchemas from '../schemas/BalanceHistorySchemas.js';

class BalanceHistoryService {
  
  static async getBalanceHistory(filters) {
    const validFilters = BalanceHistorySchemas.listBalanceHistory.parse(filters);

    const page = validFilters.page ?? 1;
    const limit = validFilters.limit;
    const { page: _p, limit: _l, ...dbFilters } = validFilters;

    if (dbFilters.accountId) {
      dbFilters.accountId = parseInt(dbFilters.accountId);
    }

    const skip = limit ? (page - 1) * limit : undefined;
    const take = limit ? parseInt(limit) : undefined;

    const [balanceHistory, total] = await Promise.all([
      BalanceHistoryRepository.findByAccountAndDateRange(
        dbFilters.accountId,
        dbFilters.startDate,
        dbFilters.endDate,
        skip,
        take,
        'desc'
      ),
      BalanceHistoryRepository.countByAccountAndDateRange(
        dbFilters.accountId,
        dbFilters.startDate,
        dbFilters.endDate
      )
    ]);

    return {
      data: balanceHistory,
      total,
      take
    };
  }

  static async recordDailyBalance(accountId, date, balance) {
    const validData = BalanceHistorySchemas.createBalanceRecord.parse({
      accountId,
      date,
      balance
    });

    const record = await BalanceHistoryRepository.createBalanceRecord(
      validData.accountId,
      validData.date,
      validData.balance
    );

    if (!record) {
      throw { code: 500, message: "Erro ao registrar histórico de saldo" };
    }

    return record;
  }

  static async recordAllAccountsDailyBalance(date = new Date()) {
    // Garantir que a data seja o final do dia anterior (23:59:59)
    const targetDate = new Date(date);
    targetDate.setUTCHours(23, 59, 59, 999);
    
    // Ajustar para o dia anterior se estivermos executando no início do dia
    if (new Date().getHours() < 2) {
      targetDate.setDate(targetDate.getDate() - 1);
    }

    // Converter para string de data para o registro (YYYY-MM-DD)
    const dateString = targetDate.toISOString().split('T')[0];

    const accounts = await BalanceHistoryRepository.getAllAccountsWithCurrentBalance();
    
    if (accounts.length === 0) {
      console.log('Nenhuma conta encontrada para registrar saldo diário');
      return { recordsCreated: 0, message: 'Nenhuma conta encontrada' };
    }

    const records = accounts.map(account => ({
      accountId: account.id,
      date: dateString,
      balance: account.balance
    }));

    try {
      const result = await BalanceHistoryRepository.bulkCreateBalanceRecords(records);
      console.log(`Registrados saldos diários para ${result.count} contas em ${dateString}`);
      
      return {
        recordsCreated: result.count,
        date: dateString,
        message: `Saldos diários registrados com sucesso`
      };
    } catch (error) {
      console.error('Erro ao registrar saldos diários:', error);
      throw { code: 500, message: "Erro ao registrar saldos diários" };
    }
  }

  static async recalculateBalanceHistory(accountId, startDate, endDate) {
    const validData = BalanceHistorySchemas.recalculateBalance.parse({
      accountId,
      startDate,
      endDate
    });

    // Primeiro, deletar registros existentes no período
    await BalanceHistoryRepository.deleteByAccountAndDateRange(
      validData.accountId,
      validData.startDate,
      validData.endDate
    );

    // Obter todas as contas (ou apenas a conta específica se accountId for fornecido)
    let accounts;
    if (validData.accountId) {
      const account = await BalanceHistoryRepository.getAllAccountsWithCurrentBalance();
      accounts = account.filter(acc => acc.id === parseInt(validData.accountId));
    } else {
      accounts = await BalanceHistoryRepository.getAllAccountsWithCurrentBalance();
    }

    if (accounts.length === 0) {
      throw { code: 404, message: "Conta não encontrada" };
    }

    // Gerar registros para cada dia no período
    const records = [];
    const start = new Date(validData.startDate);
    const end = new Date(validData.endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      
      for (const account of accounts) {
        records.push({
          accountId: account.id,
          date: dateString,
          balance: account.balance // Em uma implementação real, seria necessário calcular o saldo para cada data
        });
      }
    }

    if (records.length > 0) {
      await BalanceHistoryRepository.bulkCreateBalanceRecords(records);
    }

    return {
      message: `Histórico de saldos recalculado para o período de ${validData.startDate} até ${validData.endDate}`,
      recordsCreated: records.length
    };
  }

  static async getBalanceForDate(accountId, date) {
    try {
      const exactDateHistory = await BalanceHistoryRepository.findByAccountAndDateRange(
        accountId,
        date,
        date,
        0,
        1,
        'desc'
      );

      if (exactDateHistory && exactDateHistory.length > 0) {
        return Number(exactDateHistory[0].balance);
      }

      // Se não encontrar, busca o saldo mais próximo anterior à data
      const previousHistory = await BalanceHistoryRepository.findByAccountAndDateRange(
        accountId,
        null, 
        date,
        0,
        1,
        'desc'
      );

      if (previousHistory && previousHistory.length > 0) {
        return Number(previousHistory[0].balance);
      }
      return 0;
    } catch (error) {
      console.warn(`Erro ao buscar saldo para conta ${accountId} na data ${date}:`, error);
      return 0;
    }
  }

  static async getTotalBalanceForUserOnDate(userId, date) {
    try {
      const accounts = await BalanceHistoryRepository.getAllAccountsWithCurrentBalance();
      const userAccounts = accounts.filter(account => account.userId === parseInt(userId));

      if (userAccounts.length === 0) {
        return 0;
      }

      // Soma os saldos de todas as contas do usuário para a data
      let totalBalance = 0;
      for (const account of userAccounts) {
        const balance = await this.getBalanceForDate(account.id, date);
        totalBalance += balance;
      }

      return totalBalance;
    } catch (error) {
      console.warn(`Erro ao buscar saldo total do usuário ${userId} na data ${date}:`, error);
      return 0;
    }
  }
}

export default BalanceHistoryService;