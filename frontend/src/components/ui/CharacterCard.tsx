import { Character } from '@/lib/api';
import { GlassCard } from './GlassCard';
import { BadgeElement } from './BadgeElement';

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CharacterCard({ character, isSelected, onClick }: CharacterCardProps) {
  // Generate star string based on rarity
  const stars = Array(character.rarity).fill('★').join('');

  return (
    <GlassCard 
      className={`cursor-pointer group transition-all duration-300 ${isSelected ? 'ring-2 ring-[var(--color-hsr-gold)] bg-white/10' : 'hover:-translate-y-1'}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-5">
        {/* Placeholder for Character Icon */}
        <div className="w-16 h-16 bg-gradient-to-tr from-[#161F33] via-[#7856B7] to-[var(--color-hsr-gold)] rounded-full flex items-center justify-center p-[2px] shadow-[0_0_15px_rgba(120,86,183,0.4)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all">
          <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white group-hover:gold-gradient-text transition-all">{character.name.charAt(0)}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold group-hover:gold-gradient-text transition-all">{character.name}</h3>
          <div className="text-[var(--color-hsr-gold)] text-xs tracking-[0.2em] mt-1">{stars}</div>
          <p className="text-sm text-gray-400 mt-1 font-medium">Lv. {character.level}</p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <BadgeElement element={character.element.name as any} />
          <span className="glass-pill text-gray-300 group-hover:border-[var(--color-hsr-gold)]/50 transition-colors">{character.path.name}</span>
        </div>
      </div>
    </GlassCard>
  );
}
