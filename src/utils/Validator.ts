export function isValidYYYYMMDD(dateStr: string) {
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
  return /^\d+(\.\d{1,2})?$/.test(amount) && parseFloat(amount) > 0 && parseFloat(amount) < 100;
}
