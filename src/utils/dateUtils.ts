export function parseDate(dateStr: string): Date {
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  return new Date(year, month, day);
}

export function getLastDayOfMonth(yearMonth: string): Date {
  const [yearStr, monthStr] = [yearMonth.slice(0, 4), yearMonth.slice(4)];
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  return new Date(year, month, 0);
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}