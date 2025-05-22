import { parseDate, getLastDayOfMonth, formatDate } from '../../src/utils/dateUtils';

describe('parseDate', () => {
  it('should parse a valid date string to a Date object', () => {
    const date = parseDate('20240522');
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(4); // May (0-based)
    expect(date.getDate()).toBe(22);
  });
});

describe('getLastDayOfMonth', () => {
  it('should return the last day of a given month', () => {
    const lastDay = getLastDayOfMonth('202402');
    expect(lastDay.getFullYear()).toBe(2024);
    expect(lastDay.getMonth()).toBe(1); // February (0-based)
    expect(lastDay.getDate()).toBe(29); // Leap year
  });

  it('should return the last day for a 30-day month', () => {
    const lastDay = getLastDayOfMonth('202406');
    expect(lastDay.getDate()).toBe(30);
  });

  it('should return the last day for a 31-day month', () => {
    const lastDay = getLastDayOfMonth('202407');
    expect(lastDay.getDate()).toBe(31);
  });
});

describe('formatDate', () => {
  it('should format a Date object as YYYYMMDD', () => {
    const date = new Date(2024, 4, 9); // May 9, 2024
    expect(formatDate(date)).toBe('20240509');
  });

  it('should pad month and day with zeros', () => {
    const date = new Date(2024, 0, 1); // Jan 1, 2024
    expect(formatDate(date)).toBe('20240101');
  });
});