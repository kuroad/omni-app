import { GlassCard } from "./GlassCard";

interface CharacterProps {
  char: any;
}

export function CharacterCard({ char }: CharacterProps) {
  const is5Star = char.rarity === 5;
  const rarityColor = is5Star ? "text-yellow-400" : "text-purple-400";

  return (
    <GlassCard className="flex flex-col sm:flex-row gap-6 transition-transform hover:scale-[1.02]">
      {/* Avatar / Portrait */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden border-2 border-white/10 mx-auto sm:mx-0">
        <img 
          src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${char.icon}`}
          alt={char.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "/globe.svg" }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
        <h3 className="text-2xl font-bold text-white tracking-wide">{char.name}</h3>
        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
          <span className={`font-semibold ${rarityColor}`}>{char.rarity}★</span>
          <span className="text-white/40">•</span>
          <span className="text-gray-300">Lv. {char.level}</span>
          <span className="text-white/40">•</span>
          <span className="text-blue-300 font-medium">{char.path}</span>
        </div>

        {/* Relic Summaries */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {char.relics?.slice(0, 6).map((relic: any, idx: number) => {
            const grade = relic.score?.grade || "C";
            const gradeColor = 
              grade === "S" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
              grade === "A" ? "bg-purple-500/20 text-purple-400 border-purple-500/30" :
              grade === "B" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
              "bg-gray-500/20 text-gray-400 border-gray-500/30";

            return (
              <div key={idx} className="bg-black/30 rounded-lg p-2 text-xs text-gray-300 border border-white/5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-yellow-500 shrink-0">{relic.rarity}★</span>
                  <span className="truncate" title={relic.main_stat?.name}>{relic.main_stat?.name || "Relic"}</span>
                </div>
                <div className={`px-2 py-0.5 rounded font-bold border ${gradeColor} shrink-0`}>
                  {grade}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
