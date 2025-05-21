export type TransactionType = 'D' | 'W' | 'I';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
}
