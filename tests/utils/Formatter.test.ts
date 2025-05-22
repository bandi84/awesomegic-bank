import { generateTxnId } from '../../src/utils/Formatter';

describe('generateTxnId', () => {
  it('should generate a transaction ID with padded count', () => {
    expect(generateTxnId('20240522', 1)).toBe('20240522-01');
    expect(generateTxnId('20240522', 12)).toBe('20240522-12');
    expect(generateTxnId('19991231', 5)).toBe('19991231-05');
  });
});