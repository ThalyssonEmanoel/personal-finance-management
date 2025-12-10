// src/controllers/AccountController.test.js
import { jest } from '@jest/globals';

const mockUpdateAccount = jest.fn();
const mockSuccess = jest.fn();

jest.unstable_mockModule('../../services/AccountService.js', () => ({
  default: {
    updateAccount: mockUpdateAccount
  }
}));

jest.unstable_mockModule('../../utils/commonResponse.js', () => ({
  default: {
    success: mockSuccess
  }
}));

const { default: AccountController } = await import('../../controllers/AccountController.js');
const { default: AccountService } = await import('../../services/AccountService.js');
const { default: CommonResponse } = await import('../../utils/commonResponse.js');

describe('AccountController.updateAccount', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: { id: '1', userId: '2' },
      body: {},
      file: undefined
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    mockUpdateAccount.mockClear();
    mockSuccess.mockClear();
  });

  it('should update account with all fields and file', async () => {
    req.body = {
      name: 'Test',
      type: 'Savings',
      balance: '1000',
      paymentMethodIds: 'pm1,pm2',
      icon: 'icon.png'
    };
    req.file = { filename: 'file.png' };
    const updatedAccount = { id: 1, name: 'Test' };
    mockUpdateAccount.mockResolvedValue(updatedAccount);
    mockSuccess.mockReturnValue({ success: true });

    await AccountController.updateAccount(req, res, next);

    expect(mockUpdateAccount).toHaveBeenCalledWith(
      1, 2,
      {
        name: 'Test',
        type: 'Savings',
        balance: '1000',
        paymentMethodIds: 'pm1,pm2',
        icon: 'uploads/file.png'
      }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
    expect(next).not.toHaveBeenCalled();
  });

  it('should update account with only name and type', async () => {
    req.body = {
      name: 'Test',
      type: 'Checking'
    };
    const updatedAccount = { id: 1, name: 'Test' };
    mockUpdateAccount.mockResolvedValue(updatedAccount);
    mockSuccess.mockReturnValue({ success: true });

    await AccountController.updateAccount(req, res, next);

    expect(mockUpdateAccount).toHaveBeenCalledWith(
      1, 2,
      { name: 'Test', type: 'Checking' }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('should use icon from body if file is not present', async () => {
    req.body = { icon: 'icon.png' };
    const updatedAccount = { id: 1 };
    mockUpdateAccount.mockResolvedValue(updatedAccount);
    mockSuccess.mockReturnValue({ success: true });

    await AccountController.updateAccount(req, res, next);

    expect(mockUpdateAccount).toHaveBeenCalledWith(
      1, 2,
      { icon: 'icon.png' }
    );
  });

  it('should not include fields with empty strings', async () => {
    req.body = {
      name: '',
      type: null,
      balance: undefined,
      paymentMethodIds: '   '
    };
    const updatedAccount = { id: 1 };
    mockUpdateAccount.mockResolvedValue(updatedAccount);
    mockSuccess.mockReturnValue({ success: true });

    await AccountController.updateAccount(req, res, next);

    expect(mockUpdateAccount).toHaveBeenCalledWith(1, 2, {});
  });

  it('should call next with error if exception thrown', async () => {
    const error = new Error('fail');
    mockUpdateAccount.mockRejectedValue(error);

    await AccountController.updateAccount(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});