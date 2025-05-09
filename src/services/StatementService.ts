import { accounts } from '../data/BankData';
import { interestRules } from '../data/BankData';
import { InterestRule } from '../models/InterestRule';
import { Transaction } from '../models/Transaction';
import { parseDate, getLastDayOfMonth, daysBetween, formatDate } from '../utils/dateUtils';

export function printStatement(accountId: string, ym: string): void {
  const account = accounts.get(accountId);
  if (!account) return console.log(`Account ${accountId} not found.`);

  const txns = [...account.transactions.filter(txn => txn.date.startsWith(ym))];
  const openingBalance = calculateOpeningBalance(account.transactions, ym);

  let balance = openingBalance;

  console.log(`Account: ${accountId}`);
  console.log(`| Date     | Txn Id      | Type | Amount | Balance |`);
  for (const txn of txns) {
    balance += txn.type === 'D' || txn.type === 'I' ? txn.amount : -txn.amount;
    txn.balance = balance;
    console.log(`| ${txn.date} | ${txn.id.padEnd(11)} | ${txn.type}    | ${txn.amount.toFixed(2).padStart(6)} | ${balance.toFixed(2).padStart(7)} |`);
  }

  const [yearStr, monthStr] = [ym.slice(0, 4), ym.slice(4)];
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const lastDay = `${ym}${getLastDayOfMonth(year, month).getDate()}`;
  const interest = calculateInterest(accountId, txns, ym, openingBalance);
  if (interest > 0) {
    balance += interest;
    console.log(`| ${lastDay} |             | I    | ${interest.toFixed(2).padStart(6)} | ${balance.toFixed(2).padStart(7)} |`);
  }
}

function addStartEndMonthTransactions(accountId: string,transactions: Transaction[], startDate: Date, endDate: Date, openingBalance: number) {
  let monthTransactions: Transaction[] = [...transactions];
  if (transactions.length > 0) {
    if (parseDate(transactions[transactions.length - 1].date).getTime() !== endDate.getTime()) {
      monthTransactions.push({ ...transactions[transactions.length - 1], date: formatDate(endDate) });
    }
  } else if(openingBalance > 0){
    monthTransactions.push({ accountId: accountId, id:`${formatDate(endDate)}-01`, date: formatDate(endDate), type: 'D', balance: openingBalance, amount: 0 });
  }

  return monthTransactions;
}

function calculateInterest(accountId: string, transactions: Transaction[], yearMonth: string, openingBalance: number): number {
  const [yearStr, monthStr] = [yearMonth.slice(0, 4), yearMonth.slice(4)];
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = getLastDayOfMonth(year, month);

  const accountTxns = addStartEndMonthTransactions(accountId, [...deduplicateTransactionsByDate(transactions)], firstDay, lastDay, openingBalance);

  const txnInterestPeriods: { startDate: Date; endDate: Date; balanceAmt: number; rate: number }[] = [];
  let startTransactionDate = firstDay;
  let balanceAmt = openingBalance;

  for (const txn of accountTxns) {
    const txnDate = parseDate(txn.date);
    if (firstDay.getTime() === txnDate.getTime()) {
      balanceAmt = txn.balance || 0;
      continue;
    }

    let rulesBefore = getRuleForDate(interestRules, startTransactionDate);
    let interestRulesBetween = getInterestRulesBetween(interestRules, startTransactionDate, parseDate(txn.date));

    if (interestRulesBetween.length > 0) {
      for (const _interestRule of interestRulesBetween) {
        const previousDate = new Date(parseDate(_interestRule.date));
        previousDate.setDate(previousDate.getDate() - 1);

        txnInterestPeriods.push({
          startDate: startTransactionDate,
          endDate: previousDate,
          balanceAmt: (previousDate < parseDate(txn.date) ? balanceAmt : txn.balance) || 0,
          rate: (previousDate < parseDate(_interestRule.date) ? rulesBefore?.rate : _interestRule.rate) || 0
        });
        startTransactionDate = parseDate(_interestRule.date);
        rulesBefore = _interestRule;
      }
    }

    const endDate = new Date(parseDate(txn.date));
    if(endDate < lastDay) {
      endDate.setDate(endDate.getDate() - 1);
    }
    txnInterestPeriods.push({
      startDate: startTransactionDate,
      endDate: endDate,
      balanceAmt: balanceAmt || 0,
      rate: rulesBefore?.rate || 0
    });
    startTransactionDate = parseDate(txn.date);
    balanceAmt = txn.balance || 0;
  }

  const totalInterest = txnInterestPeriods.reduce((sum, p) => {
    const days = daysBetween(p.startDate, p.endDate);
    const interest = (p.balanceAmt * p.rate * days) / (100);
    return sum + interest;
  }, 0);

  return totalInterest/365;
}

function deduplicateTransactionsByDate(transactions: Transaction[]): Transaction[] {
  const map = new Map<string, Transaction>();

  for (const txn of transactions) {
    map.set(txn.date, txn);
  }

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function getRuleForDate(rules: InterestRule[], date: Date): InterestRule | undefined {
  let applicable: InterestRule | undefined;
  for (const rule of rules) {
    const ruleDate = parseDate(rule.date);
    if (ruleDate <= date) applicable = rule;
    else break;
  }
  return applicable;
}

function getInterestRulesBetween(rules: InterestRule[], startDate: Date, endDate: Date): InterestRule[] {
  const sorted = rules
    .filter(r => parseDate(r.date) > startDate && parseDate(r.date) < endDate)
    .sort((a, b) => a.date.localeCompare(b.date));
  return sorted;
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

function calculateOpeningBalance(transactions: Transaction[], yearMonth: string): number {
  const year = parseInt(yearMonth.slice(0, 4), 10);
  const month = parseInt(yearMonth.slice(4), 10);
  const monthStart = new Date(year, month - 1, 1);
  let balance = 0;

  for (const txn of transactions) {
    const year = parseInt(txn.date.substring(0, 4), 10);
    const month = parseInt(txn.date.substring(4, 6), 10) - 1;
    const day = parseInt(txn.date.substring(6, 8), 10);
    const txnDate = new Date(year, month, day);
    if (txnDate < monthStart) {
      if (txn.type === 'D') balance += txn.amount;
      else if (txn.type === 'W') balance -= txn.amount;
      else if (txn.type === 'I') balance += txn.amount;
    }
  }

  return parseFloat(balance.toFixed(2));
}

