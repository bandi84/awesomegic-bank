export const MESSAGES = {
  WELCOME: `Welcome to AwesomeGIC Bank! What would you like to do?
  [T] Input transactions 
  [I] Define interest rules
  [P] Print statement
  [Q] Quit
  >`,

  INPUT_TRANSACTION_PROMPT: `Please enter transaction details in <Date> <Account> <Type> <Amount> format \n (or enter blank to go back to main menu):\n> `,

  INTEREST_RULE_PROMPT: `Please enter interest rules details in <Date> <RuleId> <Rate in %> format \n (or enter blank to go back to main menu):\n> `,

  STATEMENT_PROMPT: `\nPlease enter account and month to generate the statement <Account> <Year><Month> \n(or enter blank to go back to main menu): \n> `,

  GOODBYE: `Thank you for banking with AwesomeGIC Bank.\nHave a nice day!`,

  MENU_PROMPT: `Is there anything else you'd like to do?
  [T] Input transactions 
  [I] Define interest rules
  [P] Print statement
  [Q] Quit
  >`,

  INVALID_INPUT: `Invalid input. Please try again.`,

  INVALID_RULE: `Invalid rule. Please try again.`,

  TRANSACTION_FAILED: `Transaction failed. Please try again.`,

  ACCOUNT_STATEMENT_HEADER: (accountId: string) => `Account: ${accountId}\n| Date     | Txn Id      | Type | Amount | Balance |`,

  INTEREST_RULES_HEADER: `Interest rules:
  | Date     | RuleId | Rate (%) |`
};
