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
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-hsr-gold bg-white/10' : 'hover:bg-white/5'}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Placeholder for Character Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border-2 border-hsr-gold overflow-hidden">
          <span className="text-xl font-bold">{character.name.charAt(0)}</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold">{character.name}</h3>
          <div className="text-hsr-gold text-sm tracking-widest">{stars}</div>
          <p className="text-sm text-gray-300">Lv. {character.level}</p>
        </div>

        <div className="flex flex-col gap-1 items-end">
          <BadgeElement element={character.element.name as any} />
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{character.path.name}</span>
        </div>
      </div>
    </GlassCard>
  );
}
