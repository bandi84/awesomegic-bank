export function isValidDate(input: string): boolean {
  return /^\d{8}$/.test(input);
}

export function isValidAmount(amount: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(amount) && parseFloat(amount) > 0;
}
