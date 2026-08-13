import { GlassCard } from './GlassCard';
import { BadgeElement } from './BadgeElement';

interface EncyclopediaCardProps {
  character: {
    id: string;
    name: string;
    rarity: number;
    pathId: string;
    elementId: string;
  };
}

export function EncyclopediaCard({ character }: EncyclopediaCardProps) {
  const stars = Array(character.rarity).fill('★').join('');

  return (
    <GlassCard className="cursor-pointer group transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-gradient-to-tr from-[#161F33] via-[#7856B7] to-[var(--color-hsr-gold)] rounded-full flex items-center justify-center border-2 border-transparent p-[2px] shadow-[0_0_15px_rgba(120,86,183,0.4)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all shrink-0">
          <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white group-hover:gold-gradient-text transition-all">{character.name.charAt(0)}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold group-hover:gold-gradient-text transition-all">{character.name}</h3>
          <div className="text-[var(--color-hsr-gold)] text-xs tracking-[0.2em] mt-1">{stars}</div>
        </div>

        <div className="flex flex-col gap-2 items-end shrink-0">
          <BadgeElement element={character.elementId as any} />
          <span className="glass-pill text-gray-300 group-hover:border-[var(--color-hsr-gold)]/50 transition-colors">{character.pathId}</span>
        </div>
      </div>
    </GlassCard>
  );
}
