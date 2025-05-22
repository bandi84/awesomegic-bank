import { MESSAGES } from "../constants/messages";

export function isValidDate(dateStr: string) {
  if (!/^\d{8}$/.test(dateStr)) return false;

  const year = +dateStr.slice(0, 4);
  const month = +dateStr.slice(4, 6);
  const day = +dateStr.slice(6, 8);

  return isValidDateParts(year, month, day);
}

function isValidDateParts(year: number, month: number, day: number) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isValidAmount(amount: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(amount) && parseFloat(amount) > 0;
}

export function validateTransactionRules(input: string) {
  const [date, acc, type, amountStr] = input.split(' ');
  const upperType = type.toUpperCase();
  let validationErrors: string[] = [];

  if (!isValidDate(date)) validationErrors.push(`${MESSAGES.INVALID_INPUT_TRANSACTION.DATE}`)
  if (!acc.trim()) validationErrors.push(`${MESSAGES.INVALID_INPUT_TRANSACTION.ACCOUNT}`)
  if (upperType !== 'D' && upperType !== 'W') validationErrors.push(`${MESSAGES.INVALID_INPUT_TRANSACTION.TYPE}`)
  if (!isValidAmount(amountStr)) validationErrors.push(`${MESSAGES.INVALID_INPUT_TRANSACTION.ACCOUNT}`)
  
  return validationErrors;
}

export function validateInterestRules(input: string) {
  const [date, ruleId, rateStr] = input.split(' ');
  const rate = parseFloat(rateStr);
  let validationErrors: string[] = [];

  if (!isValidDate(date)) validationErrors.push(`${MESSAGES.INVALID_RULE.DATE}`)
  if (!ruleId.trim()) validationErrors.push(`${MESSAGES.INVALID_RULE.RULE_ID}`)
  if (isNaN(rate) || rate <= 0 || rate >= 100) validationErrors.push(`${MESSAGES.INVALID_RULE.RATE}`)
  
  return validationErrors;
}
