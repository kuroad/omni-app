import { Relic } from '@/lib/api';
import { calculateRelicCV, getCVTier } from '@/lib/hsr-utils';
import { GlassCard } from './GlassCard';

interface RelicScoreCardProps {
  relic: Relic;
}

export function RelicScoreCard({ relic }: RelicScoreCardProps) {
  const cv = calculateRelicCV(relic.subStats);
  const tier = getCVTier(cv);
  const stars = Array(relic.rarity).fill('★').join('');

  return (
    <GlassCard className="flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background Tier Glow */}
      <div className={`absolute -right-10 -top-10 w-24 h-24 blur-2xl opacity-20 ${tier.color.split(' ')[0]}`} />
      
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-bold text-lg">{relic.name}</h4>
            <div className="text-hsr-gold text-sm tracking-widest">{stars}</div>
          </div>
          <div className="bg-black/50 px-2 py-1 rounded text-sm font-semibold border border-white/10">
            +{relic.level}
          </div>
        </div>
        <p className="text-xs text-gray-400 italic mb-4">{relic.setName}</p>
        
        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Main Stat</p>
          <div className="flex justify-between font-bold text-hsr-gold">
            <span>{relic.mainStat.name}</span>
            <span>{relic.mainStat.display}</span>
          </div>
        </div>

        <div className="space-y-2">
          {relic.subStats.map((stat, i) => {
            const isCrit = stat.type.includes('Critical') || stat.field.includes('crit');
            return (
              <div key={i} className="flex justify-between text-sm items-center">
                <span className={`text-gray-300 ${isCrit ? 'text-white font-semibold' : ''}`}>{stat.name}</span>
                <span className={`${isCrit ? 'text-hsr-gold font-bold' : 'text-gray-400'}`}>{stat.display}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="text-sm text-gray-400">Crit Value</div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold">{cv}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${tier.color}`}>
            {tier.grade}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
