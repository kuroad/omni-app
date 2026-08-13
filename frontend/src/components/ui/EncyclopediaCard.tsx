import { GlassCard } from "./GlassCard";

interface EncyclopediaCardProps {
  char: any;
}

export function EncyclopediaCard({ char }: EncyclopediaCardProps) {
  const is5Star = char.rarity === 5;
  const gradientColor = is5Star ? "from-yellow-500/20 to-transparent" : "from-purple-500/20 to-transparent";

  return (
    <GlassCard className={`flex flex-col group transition-transform hover:-translate-y-2 hover:shadow-3xl p-0 overflow-hidden`}>
      <div className={`relative w-full h-80 bg-gradient-to-t ${gradientColor}`}>
        <img 
          src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${char.portrait}`}
          alt={char.name}
          className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = "/globe.svg" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
        
        {/* Element & Path Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 text-white">
            {char.element}
          </div>
          <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 text-gray-300">
            {char.path}
          </div>
        </div>
      </div>
      
      <div className="p-6 relative z-10 -mt-10">
        <h3 className="text-2xl font-bold text-white tracking-wide drop-shadow-md">{char.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={`font-semibold ${is5Star ? "text-yellow-400" : "text-purple-400"}`}>
            {char.rarity}★
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
