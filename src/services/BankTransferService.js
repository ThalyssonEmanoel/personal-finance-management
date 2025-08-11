import BankTransferRepository from '../repositories/BankTransferRepository.js';
import BankTransferSchemas from '../schemas/BankTransferSchemas.js';
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

    const sourceAccountBalance = await BankTransferRepository.getAccountBalance(validBankTransfer.sourceAccountId);
    if (new Decimal(sourceAccountBalance).lessThan(validBankTransfer.amount)) {
      throw { code: 400, message: "Saldo insuficiente na conta de origem." };
    }

    const sourceNewBalance = new Decimal(sourceAccountBalance).minus(validBankTransfer.amount).toNumber();
    const destinationAccountBalance = await BankTransferRepository.getAccountBalance(validBankTransfer.destinationAccountId);
    const destinationNewBalance = new Decimal(destinationAccountBalance).plus(validBankTransfer.amount).toNumber();

    const accountUpdates = [
      {
        accountId: validBankTransfer.sourceAccountId,
        userId: validBankTransfer.userId,
        newBalance: sourceNewBalance
      },
      {
        accountId: validBankTransfer.destinationAccountId,
        userId: validBankTransfer.userId,
        newBalance: destinationNewBalance
      }
    ];

    const result = await BankTransferRepository.createBankTransferWithTransaction(validBankTransfer, accountUpdates);
    return result;
  }

  static async updateTransfer(id, userId, bankTransferData) {
    const validId = BankTransferSchemas.bankTransferIdParam.parse({ id });
    const validBankTransferData = BankTransferSchemas.updateBankTransfer.parse(bankTransferData);

    if (validBankTransferData.transfer_date) {
      validBankTransferData.transfer_date = new Date(validBankTransferData.transfer_date);
    }

    // Buscar a transferência atual para comparar valores
    const currentTransfer = await BankTransferRepository.getBankTransferById(validId.id, userId);
    if (!currentTransfer) {
      throw { code: 404, message: "Transferência bancária não encontrada." };
    }

    let accountUpdates = null;

    // Se o amount foi alterado, calcular os novos saldos das contas
    if (validBankTransferData.amount !== undefined && validBankTransferData.amount !== currentTransfer.amount) {
      const oldAmount = new Decimal(currentTransfer.amount);
      const newAmount = new Decimal(validBankTransferData.amount);
      const difference = newAmount.minus(oldAmount);

      if (difference.greaterThan(0)) {
        const sourceAccountBalance = await BankTransferRepository.getAccountBalance(currentTransfer.sourceAccountId);
        if (new Decimal(sourceAccountBalance).lessThan(difference)) {
          throw { code: 400, message: "Saldo insuficiente na conta de origem para esta atualização." };
        }
      }

      // Calcular novos saldos
      const sourceAccountBalance = await BankTransferRepository.getAccountBalance(currentTransfer.sourceAccountId);
      const destinationAccountBalance = await BankTransferRepository.getAccountBalance(currentTransfer.destinationAccountId);

      const sourceNewBalance = difference.greaterThan(0) 
        ? new Decimal(sourceAccountBalance).minus(difference.abs()).toNumber()
        : new Decimal(sourceAccountBalance).plus(difference.abs()).toNumber();

      const destinationNewBalance = difference.greaterThan(0)
        ? new Decimal(destinationAccountBalance).plus(difference.abs()).toNumber()
        : new Decimal(destinationAccountBalance).minus(difference.abs()).toNumber();

      accountUpdates = [
        {
          accountId: currentTransfer.sourceAccountId,
          userId: userId,
          newBalance: sourceNewBalance
        },
        {
          accountId: currentTransfer.destinationAccountId,
          userId: userId,
          newBalance: destinationNewBalance
        }
      ];
    }

    const result = await BankTransferRepository.updateBankTransferWithTransaction(validId.id, userId, validBankTransferData, accountUpdates);
    return result;
  }

  static async deleteTransfer(id, userId) {
    const validId = BankTransferSchemas.bankTransferIdParam.parse({ id });
    const validUserId = BankTransferSchemas.userIdParam.parse({ userId });

    const transferToDelete = await BankTransferRepository.getBankTransferById(validId.id, validUserId.userId);
    if (!transferToDelete) {
      throw { code: 404, message: "Transferência bancária não encontrada ou você não tem acesso a ela." };
    }

    // Calcular os novos saldos após reverter a transferência
    const sourceAccountBalance = await BankTransferRepository.getAccountBalance(transferToDelete.sourceAccountId);
    const destinationAccountBalance = await BankTransferRepository.getAccountBalance(transferToDelete.destinationAccountId);

    const sourceNewBalance = new Decimal(sourceAccountBalance).plus(transferToDelete.amount).toNumber();
    const destinationNewBalance = new Decimal(destinationAccountBalance).minus(transferToDelete.amount).toNumber();

    const accountUpdates = [
      {
        accountId: transferToDelete.sourceAccountId,
        userId: transferToDelete.userId,
        newBalance: sourceNewBalance
      },
      {
        accountId: transferToDelete.destinationAccountId,
        userId: transferToDelete.userId,
        newBalance: destinationNewBalance
      }
    ];

    const result = await BankTransferRepository.deleteBankTransferWithTransaction(validId.id, accountUpdates);
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
