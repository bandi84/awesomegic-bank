import { addTransaction } from '../../src/services/BankService';
import { accounts } from '../../src/data/BankData';
import * as Formatter from '../../src/utils/Formatter';

// Mock generateTxnId to return predictable IDs
jest.spyOn(Formatter, 'generateTxnId').mockImplementation((date, count) => `${date}-XX${count}`);

beforeEach(() => {
  // Clear accounts and reset for each test
  accounts.clear();
});

describe('addTransaction', () => {
  it('should create a new account and add a deposit transaction', () => {
    const txn = addTransaction('20240522', 'A1', 'D', 100);
    expect(txn).not.toBeNull();
    expect(txn?.type).toBe('D');
    expect(accounts.get('A1')).toBeDefined();
    expect(accounts.get('A1')?.transactions.length).toBe(1);
    expect(txn?.id).toBe('20240522-XX1');
  });

  it('should add a withdrawal transaction if funds are sufficient', () => {
    addTransaction('20240522', 'A2', 'D', 200);
    const txn = addTransaction('20240522', 'A2', 'W', 50);
    expect(txn).not.toBeNull();
    expect(txn?.type).toBe('W');
    expect(accounts.get('A2')?.transactions.length).toBe(2);
  });

  it('should not allow withdrawal from a non-existent account', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const txn = addTransaction('20240522', 'A3', 'W', 50);
    expect(txn).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds');
    consoleSpy.mockRestore();
  });

  it('should not allow withdrawal if funds are insufficient', () => {
    addTransaction('20240522', 'A4', 'D', 30);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const txn = addTransaction('20240522', 'A4', 'W', 100);
    expect(txn).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds');
    consoleSpy.mockRestore();
  });

  it('should increment transaction count for the same date', () => {
    addTransaction('20230626', 'A5', 'D', 10);
    const txn2 = addTransaction('20230626', 'A5', 'D', 20);
    expect(txn2?.id).toBe('20230626-XX2');
  });

  it('should treat type case-insensitively', () => {
    const txn = addTransaction('20230601', 'A6', 'd', 100);
    expect(txn?.type).toBe('D');
  });
});