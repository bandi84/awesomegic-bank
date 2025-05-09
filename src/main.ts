import readline from 'readline';
import { addTransaction } from './services/BankService';
import { addInterestRule, displayInterestRules } from './services/InterestService';
import { printStatement, displayAccountStatement } from './services/StatementService';
import { isValidAmount, isValidDate } from './utils/Validator';
import { MESSAGES } from './constants/messages';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function prompt(question: string = MESSAGES.WELCOME) {
  rl.question(`\n${question} `, handleMainInput);
}

function handleMainInput(input: string) {
  switch (input.trim().toUpperCase()) {
    case 'T': return inputTransactions();
    case 'I': return defineInterestRules();
    case 'P': return printAccountStatement();
    case 'Q': rl.close(); console.log(`${MESSAGES.GOODBYE}`); break;
    default: prompt(); break;
  }
}

function inputTransactions() {
  rl.question(`\n${MESSAGES.INPUT_TRANSACTION_PROMPT}`, input => {
    if (!input.trim()) return prompt();
    const [date, acc, type, amountStr] = input.split(' ');
    if (!isValidDate(date) || !isValidAmount(amountStr)) {
      console.log(`${MESSAGES.INVALID_INPUT}`);
      return inputTransactions();
    }

    const txn = addTransaction(date, acc, type, parseFloat(amountStr));
    if (!txn) {
      console.log(`${MESSAGES.TRANSACTION_FAILED}`);
    } else {
      displayAccountStatement(acc);
    }
    prompt(`${MESSAGES.MENU_PROMPT}`);
  });
}

function defineInterestRules() {
  rl.question(`${MESSAGES.INTEREST_RULE_PROMPT}`, input => {
    if (!input.trim()) return prompt();
    const [date, ruleId, rateStr] = input.split(' ');
    const rate = parseFloat(rateStr);
    if (!isValidDate(date) || isNaN(rate) || rate <= 0 || rate >= 100) {
      console.log(`${MESSAGES.INVALID_RULE}`);
      return defineInterestRules();
    }
    addInterestRule(date, ruleId, rate);
    displayInterestRules();
    prompt(`${MESSAGES.MENU_PROMPT}`);
  });
}

function printAccountStatement() {
  rl.question(`${MESSAGES.STATEMENT_PROMPT}`, input => {
    if (!input.trim()) return prompt();
    const [acc, ym] = input.split(' ');
    printStatement(acc, ym);
    prompt(`${MESSAGES.MENU_PROMPT}`);
  });
}

prompt();
