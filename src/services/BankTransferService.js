import BankTransferRepository from '../repositories/BankTransferRepository.js';
import BankTransferSchemas from '../schemas/BankTransferSchemas.js';
import AccountRepository from '../repositories/AccountRepository.js';
import { prisma } from "../config/prismaClient.js";
import Decimal from "decimal.js";

class BankTransferService {

  static async listBankTransfers(filtros, order = 'asc') {
    const validFiltros = BankTransferSchemas.listBankTransfer.parse(filtros);
    const page = validFiltros.page ?? 1;
    const limit = validFiltros.limit ?? 10;
    const { page: _p, limit: _l, ...dbFilters } = validFiltros;

    if (dbFilters.id) {
      dbFilters.id = parseInt(dbFilters.id);
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit, 10);
    const [bankTransfers, total] = await Promise.all([
      BankTransferRepository.listBankTransfers(dbFilters, skip, take, order),
      BankTransferRepository.countBankTransfers(dbFilters)
    ]);
    return { bankTransfers, total, take };
  }

  static async createTransfer(bankTransferData) {
    const validBankTransfer = BankTransferSchemas.createBankTransfer.parse(bankTransferData);
    
    // Converter transfer_date string para Date object
    if (validBankTransfer.transfer_date) {
      validBankTransfer.transfer_date = new Date(validBankTransfer.transfer_date);
    }
    
    // Validar que o usuário possui ambas as contas
    const [isSourceOwner, isDestinationOwner] = await Promise.all([
      BankTransferRepository.validateAccountOwnership(validBankTransfer.sourceAccountId, validBankTransfer.userId),
      BankTransferRepository.validateAccountOwnership(validBankTransfer.destinationAccountId, validBankTransfer.userId)
    ]);

    if (!isSourceOwner) {
      throw { code: 403, message: "Você não possui acesso à conta de origem." };
    }

    if (!isDestinationOwner) {
      throw { code: 403, message: "Você não possui acesso à conta de destino." };
    }

    // Verificar se a conta de origem tem saldo suficiente
    const sourceAccountBalance = await BankTransferRepository.getAccountBalance(validBankTransfer.sourceAccountId);
    if (new Decimal(sourceAccountBalance).lessThan(validBankTransfer.amount)) {
      throw { code: 400, message: "Saldo insuficiente na conta de origem." };
    }

    try {
      // Usar transação para garantir consistência dos dados
      const result = await prisma.$transaction(async (prisma) => {
        // Criar a transferência bancária no banco de dados
        const newBankTransfer = await BankTransferRepository.createBankTransfer(validBankTransfer);
        
        // Atualizar os saldos das contas
        await Promise.all([
          this.updateAccountBalance({
            accountId: validBankTransfer.sourceAccountId,
            userId: validBankTransfer.userId,
            amount: validBankTransfer.amount,
            operation: 'subtract'
          }),
          this.updateAccountBalance({
            accountId: validBankTransfer.destinationAccountId,
            userId: validBankTransfer.userId,
            amount: validBankTransfer.amount,
            operation: 'add'
          })
        ]);

        return newBankTransfer;
      });

      return result;
    } catch (error) {
      console.error("Erro ao criar transferência bancária:", error);
      throw { code: 500, message: "Erro interno ao processar transferência." };
    }
  }

  static async updateAccountBalance({ accountId, userId, amount, operation }) {
    const accounts = await AccountRepository.listAccounts({ id: accountId, userId }, 0, 1, 'asc');
    const account = accounts[0];
    const balance = new Decimal(account.balance);
    const newBalance = operation === 'add' ? balance.plus(amount) : balance.minus(amount);
    await AccountRepository.updateAccount(accountId, userId, { balance: newBalance.toNumber() });
  }

  static async updateTransfer(id, userId, bankTransferData) {
    const validId = BankTransferSchemas.bankTransferIdParam.parse({ id });
    const validBankTransferData = BankTransferSchemas.updateBankTransfer.parse(bankTransferData);

    // Converter transfer_date string para Date object se presente
    if (validBankTransferData.transfer_date) {
      validBankTransferData.transfer_date = new Date(validBankTransferData.transfer_date);
    }

    const updatedBankTransfer = await BankTransferRepository.updateBankTransfer(validId.id, userId, validBankTransferData);
    if (!updatedBankTransfer) {
      throw { code: 404, message: "Transferência bancária não encontrada." };
    }
    return updatedBankTransfer;
  }

  static async deleteTransfer(id) {
    const validId = BankTransferSchemas.bankTransferIdParam.parse({ id });
    const result = await BankTransferRepository.deleteBankTransfer(validId.id);
    return result;
  }

  static async getCompatiblePaymentMethods(accountId) {
    const compatibleMethods = await BankTransferRepository.getCompatiblePaymentMethods(accountId);

    return compatibleMethods.map(apm => ({
      id: apm.paymentMethod.id,
      name: apm.paymentMethod.name
    }));
  }
}

export default BankTransferService;
