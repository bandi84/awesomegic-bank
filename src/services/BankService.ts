import { accounts } from '../data/BankData';
import { Transaction, TransactionType } from '../models/Transaction';
import { generateTxnId } from '../utils/Formatter';

const txnCounters: Map<string, number> = new Map();

export function addTransaction(date: string, accountId: string, type: string, amount: number): Transaction | null {
  const upperType = type.toUpperCase() as TransactionType;
  let account = accounts.get(accountId);

  if (!account) {
    if (upperType === 'W') return null;
    account = { id: accountId, transactions: [] };
    accounts.set(accountId, account);
  }

  const balance = account.transactions.reduce((acc, txn) =>
    txn.type === 'D' || txn.type === 'I' ? acc + txn.amount : acc - txn.amount, 0);

  if (upperType === 'W' && balance < amount) return null;

  const count = (txnCounters.get(date) || 0) + 1;
  txnCounters.set(date, count);

  const txn: Transaction = {
    id: generateTxnId(date, count),
    date,
    accountId,
    type: upperType,
    amount
  };

  account.transactions.push(txn);
  return txn;
}
