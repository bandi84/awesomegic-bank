import { addTransaction } from './services/BankService';
import { addInterestRule, displayInterestRules } from './services/InterestService';
import { printStatement, displayAccountStatement } from './services/StatementService';
import { validateInterestRules, validateTransactionRules } from './utils/Validator';
import { MESSAGES } from './constants/messages';
import { askQuestion, close } from './main.helper';


async function prompt(question: string = MESSAGES.WELCOME): Promise<void> {
  let input = await askQuestion(`\n${question} `);
  switch (input.trim().toUpperCase()) {
    case 'T': return inputTransactions();
    case 'I': return defineInterestRules();
    case 'P': return printAccountStatement();
    case 'Q': close(); console.log(`${MESSAGES.GOODBYE}`); break;
    default: prompt(); break;
  }
}

async function inputTransactions():Promise<void> {
  let input = await askQuestion(`\n${MESSAGES.INPUT_TRANSACTION_PROMPT}`);

  if (!input.trim()) return prompt();
  const validationErrors = validateTransactionRules(input.trim())
  if (validationErrors.length) {
    console.log(`\n${validationErrors.join("\n")}`);
    return inputTransactions();
  }
  
  const [date, acc, type, amountStr] = input.split(' ');
  const txn = addTransaction(date, acc, type, parseFloat(amountStr));
  if (!txn) {
    console.log(`${MESSAGES.TRANSACTION_FAILED}`);
  } else {
    displayAccountStatement(acc);
  }

  prompt(`${MESSAGES.MENU_PROMPT}`);
}

async function defineInterestRules() {
  let input = await askQuestion(`\n${MESSAGES.INTEREST_RULE_PROMPT}`);

  if (!input.trim()) return prompt();
  const validationErrors = validateInterestRules(input.trim())
  if (validationErrors.length) {
    console.log(`\n${validationErrors.join("\n")}`);
    return defineInterestRules();
  }
  
  const [date, ruleId, rateStr] = input.split(' ');
  const rate = parseFloat(rateStr);
  addInterestRule(date, ruleId, rate);

  displayInterestRules();

  prompt(`${MESSAGES.MENU_PROMPT}`);
}

async function printAccountStatement() {
  let input = await askQuestion(`\n${MESSAGES.STATEMENT_PROMPT}`);

  if (!input.trim()) return prompt();

  const [acc, ym] = input.split(' ');
  printStatement(acc, ym);

  prompt(`${MESSAGES.MENU_PROMPT}`);
}

prompt();
