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

  INVALID_INPUT_TRANSACTION: {
      DATE: `Invalid Transaction Date. Please retry in correct format.`,
      ACCOUNT: `Invalid Account. Please retry in correct format.`,
      AMOUNT: `Invalid Transaction Amount. Please retry in correct format.`,
      TYPE: `Invalid Transaction Type. Please retry in correct format.`,
  },

  INVALID_RULE: {
    DATE: `Invalid RULE Date. Please retry in correct format.`,
    RULE_ID: `Invalid RULE ID. Please retry in correct format.`,
    RATE: `Invalid RULE Rate. Please retry in correct format`,
  },

  TRANSACTION_FAILED: `Transaction failed. Please try again.`,

  ACCOUNT_STATEMENT_HEADER: (accountId: string) => `Account: ${accountId}\n| Date     | Txn Id      | Type | Amount | Balance |`,

  INTEREST_RULES_HEADER: `Interest rules:
  | Date     | RuleId | Rate (%) |`
};
