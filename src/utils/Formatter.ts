export function formatDate(date: string): string {
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
}

export function generateTxnId(date: string, count: number): string {
  return `${date}-${count.toString().padStart(2, '0')}`;
}
