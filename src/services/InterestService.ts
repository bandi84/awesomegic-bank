import { interestRules } from '../data/BankData';
import { InterestRule } from '../models/InterestRule';

export function addInterestRule(date: string, ruleId: string, rate: number): void {
  const filtered = interestRules.filter(rule => rule.date !== date);
  filtered.push({ date, ruleId, rate });
  interestRules.length = 0;
  interestRules.push(...filtered.sort((a, b) => a.date.localeCompare(b.date)));
}

export function getApplicableRate(date: string): InterestRule | undefined {
  return [...interestRules]
    .filter(rule => rule.date <= date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function displayInterestRules() {
  console.log(`Interest rules:`);
  console.log('| Date     | Rule Id | Rate (%) |');

  (interestRules || []).forEach(rule => {
    console.log(`| ${rule.date} | ${rule.ruleId.padStart(6)} | ${rule.rate.toFixed(2).padStart(8)} |`);
  });

}
