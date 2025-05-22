import { printStatement, displayAccountStatement } from '../../src/services/StatementService';
import { accounts, interestRules } from '../../src/data/BankData';
import { Transaction } from '../../src/models/Transaction';

beforeEach(() => {
  accounts.clear();
  interestRules.length = 0;
});

describe('printStatement', () => {
  it('should print a statement for an account with transactions and interest', () => {
    accounts.set('A1', {
      id: 'A1',
      transactions: [
        { id: 'T1', date: '20240501', type: 'D', amount: 100 } as Transaction,
        { id: 'T2', date: '20240510', type: 'W', amount: 50 } as Transaction,
      ]
    });
    interestRules.push({ date: '20240501', ruleId: 'R1', rate: 3 });

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    printStatement('A1', '202405');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Account: A1'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('| 20240501 | T1'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('| 20240510 | T2'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('| 20240531 |'));
    logSpy.mockRestore();
  });

  it('should print not found message for missing account', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    printStatement('NOACC', '202405');
    expect(logSpy).toHaveBeenCalledWith('Account NOACC not found.');
    logSpy.mockRestore();
  });

  it('should print a statement with only interest if no transactions', () => {
    accounts.set('A2', { id: 'A2', transactions: [] });
    interestRules.push({ date: '20240501', ruleId: 'R1', rate: 2 });
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    printStatement('A2', '202405');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Account: A2'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('| 20240531 |'));
    logSpy.mockRestore();
  });
});

describe('displayAccountStatement', () => {
  it('should print all transactions for an account', () => {
    accounts.set('A3', {
      id: 'A3',
      transactions: [
        { id: 'T1', date: '20240501', type: 'D', amount: 100 } as Transaction,
        { id: 'T2', date: '20240502', type: 'W', amount: 20 } as Transaction,
      ]
    });
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    displayAccountStatement('A3');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Account: A3'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('| 20240501 | T1'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('| 20240502 | T2'));
    logSpy.mockRestore();
  });

  it('should print header even if account has no transactions', () => {
    accounts.set('A4', { id: 'A4', transactions: [] });
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    displayAccountStatement('A4');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Account: A4'));
    expect(logSpy).toHaveBeenCalledWith('| Date     | Txn Id      | Type | Amount |');
    logSpy.mockRestore();
  });

  it('should print header even if account does not exist', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    displayAccountStatement('NOACC');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Account: NOACC'));
    expect(logSpy).toHaveBeenCalledWith('| Date     | Txn Id      | Type | Amount |');
    logSpy.mockRestore();
  });
});