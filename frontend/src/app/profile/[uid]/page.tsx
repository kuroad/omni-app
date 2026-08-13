'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfilePageProps {
  params: { uid: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const uid = params.uid;
  const router = useRouter();
  const [searchUid, setSearchUid] = useState(uid);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profile', uid],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/user/${uid}`);
      if (!res.ok) throw new Error(await res.text() || 'Failed to fetch profile');
      return res.json();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUid.length === 9) {
      router.push(`/profile/${searchUid}`);
    }
  };

  const selectedChar = data?.characters?.find((c: any) => c.id === selectedCharId) || data?.characters?.[0];

  return (
    <main className="min-h-screen bg-[#0B0F19] text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-md"
            placeholder="Search UID..."
            value={searchUid}
            onChange={(e) => setSearchUid(e.target.value)}
          />
        </form>

        {isLoading && (
          <div className="text-center py-20 text-blue-400 animate-pulse text-xl">
            Warping Data from Astral Express...
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-red-400 p-8 border border-red-500/30 bg-red-500/10 rounded-2xl backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-2">Trailblazer Not Found</h2>
            <p>{error instanceof Error ? error.message : 'Unknown anomaly detected'}</p>
          </div>
        )}

        {data && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hoyolab Style Player Header */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141A29] p-6 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              <img 
                src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${data.avatar}`} 
                alt="Avatar" 
                className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-yellow-500/50 bg-black/50 z-10 shadow-lg"
                onError={(e) => { e.currentTarget.src = "/globe.svg" }}
              />
              <div className="z-10 flex-1">
                <h1 className="text-3xl font-bold text-white">{data.nickname}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2">
                  <span className="bg-white/10 px-3 py-1 rounded-md text-xs font-medium text-gray-300">
                    UID: {data.uid}
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-md text-xs font-medium border border-blue-500/20">
                    Lv. {data.level}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-3 italic">"{data.signature || 'No signature'}"</p>
                
                {/* Space Info (Tahap 6) */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  {data.space_info?.avatar_count > 0 && (
                    <span className="bg-purple-500/10 text-purple-300 px-3 py-1.5 rounded-md text-xs font-bold border border-purple-500/30 flex items-center gap-2">
                      👥 {data.space_info.avatar_count} Characters
                    </span>
                  )}
                  {data.space_info?.achievement_count > 0 && (
                    <span className="bg-yellow-500/10 text-yellow-300 px-3 py-1.5 rounded-md text-xs font-bold border border-yellow-500/30 flex items-center gap-2">
                      🏆 {data.space_info.achievement_count} Achievements
                    </span>
                  )}
                  {data.space_info?.memory_data?.chaos_level > 0 && (
                    <span className="bg-red-500/10 text-red-300 px-3 py-1.5 rounded-md text-xs font-bold border border-red-500/30 flex items-center gap-2">
                      ⚔️ MoC Floor {data.space_info.memory_data.chaos_level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Hoyolab Battle Records Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Sidebar: Character List */}
              <div className="lg:w-80 shrink-0 space-y-4">
                <h3 className="text-lg font-bold px-2 text-white">Characters Showcase</h3>
                <div className="flex overflow-x-auto lg:flex-col gap-3 pb-4 lg:pb-0 hide-scrollbar">
                  {data.characters?.map((char: any) => {
                    const isSelected = selectedChar?.id === char.id;
                    const rarityColor = char.rarity === 5 ? "from-yellow-600/40 to-yellow-900/40 border-yellow-500/50" : "from-purple-600/40 to-purple-900/40 border-purple-500/50";
                    
                    return (
                      <button
                        key={char.id}
                        onClick={() => setSelectedCharId(char.id)}
                        className={`shrink-0 flex items-center gap-4 p-2 pr-6 rounded-xl border transition-all text-left relative overflow-hidden
                          ${isSelected 
                            ? `bg-gradient-to-r ${rarityColor} scale-[1.02] shadow-lg` 
                            : "bg-[#141A29] border-white/5 hover:bg-white/10 hover:border-white/20"
                          }
                        `}
                      >
                        {/* Eidolon Mini Indicator */}
                        {char.rank > 0 && (
                          <div className="absolute top-1 right-2 text-[10px] font-black text-yellow-500">
                            E{char.rank}
                          </div>
                        )}
                        <img 
                          src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${char.icon}`}
                          className={`w-12 h-12 rounded-lg bg-black/40 ${char.rarity === 5 ? 'border-b-2 border-yellow-500' : 'border-b-2 border-purple-500'}`}
                        />
                        <div>
                          <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-200'}`}>{char.name}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            Lv. {char.level} • {char.element} • {char.path}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Detail View */}
              {selectedChar && (
                <div className="flex-1 space-y-6">
                  {/* Selected Character Header */}
                  <div className="relative rounded-2xl overflow-hidden bg-[#141A29] border border-white/10 p-6 flex flex-col md:flex-row gap-8 items-center md:items-start min-h-[300px]">
                    <div className="absolute inset-0 opacity-20 pointer-events-none" 
                         style={{ 
                           backgroundImage: `url(https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${selectedChar.portrait})`,
                           backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(20px)' 
                         }} 
                    />
                    
                    {/* Eidolon Rank Badge */}
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black font-extrabold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] z-20 text-sm">
                        EIDOLON {selectedChar.rank}
                    </div>
                    
                    <Link href={`/encyclopedia/character/${selectedChar.id}`} className="z-10 group cursor-pointer relative" title="View Full Archive Data">
                      <img 
                        src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${selectedChar.preview}`}
                        className="w-48 md:w-56 h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] object-contain group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute -bottom-4 inset-x-0 text-center opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-blue-500/80 text-white py-1 rounded-full backdrop-blur-sm">
                        View Data Bank ↗
                      </div>
                    </Link>
                    
                    <div className="z-10 flex-1 w-full text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <span className="text-yellow-500 font-bold">{selectedChar.rarity}★</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-gray-300">{selectedChar.path}</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-gray-300">{selectedChar.element}</span>
                      </div>
                      <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">{selectedChar.name}</h2>
                      <div className="text-blue-400 font-bold mb-6">Level {selectedChar.level}</div>
                      
                      {/* Light Cone Sub-section */}
                      {selectedChar.light_cone && (
                        <Link href={`/encyclopedia/lightcones/${selectedChar.light_cone.id}`} className="inline-flex items-center gap-4 bg-black/40 border border-white/10 p-3 rounded-xl mb-4 text-left w-full max-w-sm hover:bg-white/10 transition-colors cursor-pointer group">
                          <img src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${selectedChar.light_cone.icon}`} className="w-14 h-14 rounded-md border border-white/20 bg-[#141A29] group-hover:scale-105 transition-transform" />
                          <div className="flex-1 min-w-0">
                            <div className="text-yellow-500 text-[10px] font-black uppercase tracking-wider mb-0.5">
                              {selectedChar.light_cone.rarity}★ (Superimposition {selectedChar.light_cone.rank})
                            </div>
                            <div className="text-white text-sm font-bold truncate group-hover:text-blue-400 transition-colors">{selectedChar.light_cone.name}</div>
                            <div className="text-gray-400 text-xs mt-0.5">Lv. {selectedChar.light_cone.level}</div>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Stats & Traces Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Combat Stats */}
                    <div className="bg-[#141A29] rounded-2xl border border-white/10 p-6 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
                        📊 Combat Attributes
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedChar.properties?.map((prop: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-xs font-medium text-gray-400 flex items-center gap-2">
                                {prop.icon && <img src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${prop.icon}`} className="w-4 h-4 opacity-70" />}
                                {prop.name}
                            </span>
                            <span className="text-sm font-bold text-white drop-shadow-sm">{prop.display}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Traces / Skills */}
                    <div className="bg-[#141A29] rounded-2xl border border-white/10 p-6 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
                        ✨ Traces (Skills)
                      </h3>
                      <div className="space-y-3">
                        {selectedChar.skills?.map((skill: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                            <img src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${skill.icon}`} className="w-10 h-10 bg-black/60 rounded-full border border-white/20 p-1" />
                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{skill.type_text}</div>
                                <div className="text-sm font-bold text-gray-200 truncate">{skill.name}</div>
                            </div>
                            <div className="text-xs font-black text-blue-300 bg-blue-500/20 px-2.5 py-1 rounded-md border border-blue-500/30">
                                Lv. {skill.level}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Relics Section */}
                  <div className="bg-[#141A29] rounded-2xl border border-white/10 p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
                      🛡️ Equipped Relics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedChar.relics?.map((relic: any, idx: number) => {
                        const grade = relic.score?.grade || "C";
                        const gradeColors: Record<string, string> = {
                          "S": "text-orange-400 bg-orange-500/10 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]",
                          "A": "text-purple-400 bg-purple-500/10 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
                          "B": "text-blue-400 bg-blue-500/10 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
                          "C": "text-gray-400 bg-gray-500/10 border-gray-500/30"
                        };
                        
                        return (
                          <Link href={`/encyclopedia/relics/${relic.id}`} key={idx} className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${relic.icon}`} className="w-12 h-12 rounded-full border-2 border-yellow-500/50 group-hover:scale-110 transition-transform" />
                                <div className="absolute -bottom-1 -right-1 bg-black/80 text-yellow-500 text-[10px] px-1 rounded font-bold border border-yellow-500/30">
                                  +{relic.level}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors" title={relic.main_stat?.name}>
                                  {relic.main_stat?.name} <span className="text-blue-400">{relic.main_stat?.display}</span>
                                </div>
                                <div className="text-[10px] text-gray-500 truncate mt-0.5">{relic.set_name}</div>
                              </div>
                              <div className={`px-2.5 py-1.5 rounded-lg text-sm font-black border ${gradeColors[grade]}`}>
                                {grade}
                              </div>
                            </div>
                            
                            {/* Substats */}
                            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
                              {relic.sub_stats?.map((sub: any, sIdx: number) => (
                                <div key={sIdx} className="flex justify-between items-center text-[11px]">
                                  <span className="text-gray-400 truncate pr-1">{sub.name}</span>
                                  <span className="text-gray-200 font-medium">{sub.display}</span>
                                </div>
                              ))}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}
