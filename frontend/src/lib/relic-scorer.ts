/**
 * Menghitung Crit Value (CV) dari sebuah Relik.
 * Rumus komunitas: CV = (CRIT Rate% * 2) + CRIT DMG%
 */
export function calculateRelicCV(subStats: { type: string; value: number }[]): number {
  let cv = 0;
  
  for (const stat of subStats) {
    if (stat.type === 'CriticalChanceBase') { // Asumsi ID/tipe dari Mihomo untuk Crit Rate
      cv += stat.value * 100 * 2;
    } else if (stat.type === 'CriticalDamageBase') { // Asumsi ID/tipe dari Mihomo untuk Crit DMG
      cv += stat.value * 100;
    }
  }
  
  return Number(cv.toFixed(1));
}

/**
 * Mendapatkan tier skor Relik berdasarkan CV.
 * Catatan: Threshold ini adalah opini komunitas.
 */
export function getRelicTierByCV(cv: number): 'S' | 'A' | 'B' | 'C' {
  if (cv >= 40) return 'S'; // OP
  if (cv >= 30) return 'A'; // Bagus
  if (cv >= 20) return 'B'; // Lumayan
  return 'C';               // Ampas
}
