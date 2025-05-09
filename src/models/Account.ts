import { Transaction } from './Transaction';

export interface Account {
  id: string;
  transactions: Transaction[];
}
