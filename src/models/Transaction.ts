export type TransactionType = 'D' | 'W' | 'I';

export interface Transaction {
  id: string;
  date: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  balance?: number;
}
