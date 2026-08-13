import { RelicSubStat } from './api';

export function calculateRelicCV(subStats: RelicSubStat[]): number {
  let cv = 0;
  for (const stat of subStats) {
    // Mihomo usually uses 'CriticalChanceBase' or 'CriticalDamageBase' for field/type
    // Often 'field' is 'crit_rate' or 'crit_dmg'
    if (stat.type === 'CriticalChanceBase' || stat.field === 'crit_rate') {
      cv += (stat.value * 100) * 2;
    } else if (stat.type === 'CriticalDamageBase' || stat.field === 'crit_dmg') {
      cv += (stat.value * 100);
    }
  }
  return Number(cv.toFixed(1));
}

export function getCVTier(cv: number): { grade: string; color: string } {
  if (cv >= 40) return { grade: 'SS', color: 'bg-yellow-400 text-black border border-yellow-200' };
  if (cv >= 30) return { grade: 'S', color: 'bg-purple-500 text-white border border-purple-300' };
  if (cv >= 20) return { grade: 'A', color: 'bg-blue-500 text-white border border-blue-300' };
  return { grade: 'B', color: 'bg-gray-600 text-gray-200 border border-gray-400' };
}
