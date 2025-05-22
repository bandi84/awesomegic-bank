export function generateTxnId(date: string, count: number): string {
  return `${date}-${count.toString().padStart(2, '0')}`;
}
