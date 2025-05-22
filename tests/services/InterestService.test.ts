import { addInterestRule, getApplicableRate, displayInterestRules } from '../../src/services/InterestService';
import { interestRules } from '../../src/data/BankData';

beforeEach(() => {
  interestRules.length = 0; // Clear rules before each test
});

describe('addInterestRule', () => {
  it('should add a new interest rule and sort by date', () => {
    addInterestRule('20240501', 'R1', 5.0);
    addInterestRule('20240401', 'R2', 4.0);
    expect(interestRules.length).toBe(2);
    expect(interestRules[0].date).toBe('20240401');
    expect(interestRules[1].date).toBe('20240501');
  });

  it('should replace rule with the same date', () => {
    addInterestRule('20240501', 'R1', 5.0);
    addInterestRule('20240501', 'R2', 6.0);
    expect(interestRules.length).toBe(1);
    expect(interestRules[0].ruleId).toBe('R2');
    expect(interestRules[0].rate).toBe(6.0);
  });
});

describe('displayInterestRules', () => {
  it('should print the interest rules table', () => {
    addInterestRule('20240501', 'R1', 5.0);
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    displayInterestRules();
    expect(logSpy).toHaveBeenCalledWith('Interest rules:');
    expect(logSpy).toHaveBeenCalledWith('| Date     | Rule Id | Rate (%) |');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('| 20240501 | R1      |     5.00 |'));
    logSpy.mockRestore();
  });
});