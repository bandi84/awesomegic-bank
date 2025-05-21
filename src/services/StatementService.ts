import { accounts } from '../data/BankData';
import { interestRules } from '../data/BankData';
import { InterestRule } from '../models/InterestRule';
import { Transaction } from '../models/Transaction';
import { parseDate, getLastDayOfMonth } from '../utils/dateUtils';

export function printStatement(accountId: string, ym: string): void {
  const account = accounts.get(accountId);
  if (!account) return console.log(`Account ${accountId} not found.`);

  const txns = [...account.transactions.filter(txn => txn.date.startsWith(ym)).sort((a, b) => a.date.localeCompare(b.date))];
  const openingBalance = calculateOpeningBalance(account.transactions, `${ym}01`);

  let balance = openingBalance;

  console.log(`Account: ${accountId}`);
  console.log(`| Date     | Txn Id      | Type | Amount | Balance |`);
  for (const txn of txns) {
    balance += txn.type === 'D' || txn.type === 'I' ? txn.amount : -txn.amount;
    console.log(`| ${txn.date} | ${txn.id.padEnd(11)} | ${txn.type}    | ${txn.amount.toFixed(2).padStart(6)} | ${balance.toFixed(2).padStart(7)} |`);
  }

  const lastDay = `${ym}${getLastDayOfMonth(ym).getDate()}`;
  const interest = calculateInterest(txns, ym, openingBalance);
  if (interest > 0) {
    balance += interest;
    console.log(`| ${lastDay} |             | I    | ${interest.toFixed(2).padStart(6)} | ${balance.toFixed(2).padStart(7)} |`);
  }
}

function calculateInterest(transactions: Transaction[], yearMonth: string, openingBalance: number): number {
  const lastDay = getLastDayOfMonth(yearMonth).getDate();

  let balanceAmt = openingBalance;
  let interestRule = null;
  let totalInterest = 0;

  for (let i = 1; i <= lastDay; i++) {
    const currentDate = `${yearMonth}${String(i).padStart(2, '0')}`;
    balanceAmt = getEndOfTheDayBalance(transactions, currentDate, balanceAmt);
    interestRule = getInterestRuleOfDate(interestRules, currentDate);

    if(interestRule && balanceAmt > 0) {
      totalInterest += (balanceAmt * interestRule.rate)/100;
    }
  }

  return totalInterest > 0 ? (totalInterest / 365) : totalInterest;
}

function getEndOfTheDayBalance(transactions: Transaction[], date: string, previousDayBalance: number) {
  const txns = transactions.filter(txn => txn.date === date);
  return txns.length > 0 ? 
    previousDayBalance + txns.reduce((balance, txn) => balance + (txn.type === 'D' || txn.type === 'I' ? txn.amount : -txn.amount), 0) : 
    previousDayBalance;
}

function getInterestRuleOfDate(rules: InterestRule[], date: string): InterestRule | null {
    const sorted = rules
    .filter(r => parseDate(r.date) <= parseDate(date))
    .sort((a, b) => b.date.localeCompare(a.date));
  return sorted.length > 0 ? sorted[0] : null;
}

export function displayAccountStatement(accountId: string) {
  console.log(`\nAccount: ${accountId}`);
  console.log('| Date     | Txn Id      | Type | Amount |');

  const account = accounts.get(accountId);
  if (account) {
    account.transactions.forEach(txn => {
      console.log(`| ${txn.date} | ${txn.id.padEnd(11)} | ${txn.type}    | ${txn.amount.toFixed(2).padStart(6)} |`);
    });
  }
};

function calculateOpeningBalance(transactions: Transaction[], date: string) {
  const txns = transactions.filter(txn => parseDate(txn.date) < parseDate(date));
  let balance = txns.reduce((balance, txn) => balance + (txn.type === 'D' || txn.type === 'I' ? txn.amount : -txn.amount), 0);

  return parseFloat(balance.toFixed(2));
}

