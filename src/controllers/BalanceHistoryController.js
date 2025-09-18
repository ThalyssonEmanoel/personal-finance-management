import BalanceHistoryService from '../services/BalanceHistoryService.js';
import BalanceHistorySchemas from '../schemas/BalanceHistorySchemas.js';
import CommonResponse from "../utils/commonResponse.js";

class BalanceHistoryController {

  static getBalanceHistory = async (req, res, next) => {
    try {
      const query = req.query;
      const queryFiltered = BalanceHistorySchemas.listBalanceHistoryQuery.parse(query);
      const page = queryFiltered.page ? Number(queryFiltered.page) : 1;
      
      const filters = {
        accountId: queryFiltered.accountId,
        startDate: queryFiltered.startDate,
        endDate: queryFiltered.endDate,
        page: queryFiltered.page,
        limit: queryFiltered.limit
      };

      const { data, total, take } = await BalanceHistoryService.getBalanceHistory(filters);
      res.status(200).json(CommonResponse.success(data, total, page, take));
    } catch (err) {
      next(err);
    }
  };

  static recalculateBalanceHistory = async (req, res, next) => {
    try {
      const query = req.query;
      const validQuery = BalanceHistorySchemas.recalculateBalance.parse(query);

      const result = await BalanceHistoryService.recalculateBalanceHistory(
        validQuery.accountId,
        validQuery.startDate,
        validQuery.endDate
      );

      res.status(200).json(CommonResponse.success(result));
    } catch (err) {
      next(err);
    }
  };

  static recordDailyBalance = async (req, res, next) => {
    try {
      const result = await BalanceHistoryService.recordAllAccountsDailyBalance();
      res.status(201).json(CommonResponse.success(result));
    } catch (err) {
      next(err);
    }
  };
}

export default BalanceHistoryController;