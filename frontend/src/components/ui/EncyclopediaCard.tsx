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
    <GlassCard className="hover:bg-white/5 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border-2 border-hsr-gold overflow-hidden shrink-0">
          <span className="text-xl font-bold">{character.name.charAt(0)}</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold">{character.name}</h3>
          <div className="text-hsr-gold text-sm tracking-widest">{stars}</div>
        </div>

        <div className="flex flex-col gap-1 items-end shrink-0">
          <BadgeElement element={character.elementId as any} />
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{character.pathId}</span>
        </div>
      </div>
    </GlassCard>
  );
}
