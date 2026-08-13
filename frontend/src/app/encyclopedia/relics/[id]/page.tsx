'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

export default function RelicWikiPage({ params }: PageProps) {
  const { data: relic, isLoading, isError } = useQuery({
    queryKey: ['encyclopedia', 'relic', params.id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/encyclopedia/relics/${params.id}`);
      if (!res.ok) throw new Error('Relic not found');
      return res.json();
    },
  });

  const [level, setLevel] = useState(15);

  if (isLoading) {
    return <div className="text-white text-center py-20 text-xl animate-pulse">Loading Archive Data...</div>;
  }

  if (isError || !relic) {
    return <div className="text-white text-center py-20 text-2xl">404 - Relic Not Found in Archive</div>;
  }

  // Parse static data
  let staticData: any = {};
  if (relic.staticData) {
    staticData = typeof relic.staticData === 'string' ? JSON.parse(relic.staticData) : relic.staticData;
  }
  
  const setEffect = staticData.setEffect;

  const calcStat = (base: number, step: number) => {
    return (base + step * level).toFixed(1);
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-gray-100">
      {/* Hero Header */}
      <div className="relative w-full min-h-[400px] overflow-hidden flex items-center">
        {/* Blurred Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: `url(https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${relic.icon})`,
               backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(50px)' 
             }} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row items-center pt-24 pb-12 gap-8 md:gap-16">
          {/* Sisi Kiri: Splash Art */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <img 
              src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${relic.icon}`}
              className="w-full max-w-[200px] md:max-w-[250px] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] pointer-events-none rounded-full border-4 border-white/10"
            />
          </div>

          {/* Sisi Kanan: Teks Info */}
          <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <span className="bg-yellow-500/20 text-yellow-500 px-5 py-2 rounded-full border border-yellow-500/30 shadow-lg text-sm font-black">
                 {relic.rarity}★ Relic
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tighter leading-tight mb-2">
              {relic.name}
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-6">{relic.setName}</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 mx-auto md:mx-0" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 relative z-20">
        
        <Link href="/encyclopedia" className="inline-block text-blue-400 hover:text-blue-300 transition-colors font-medium border border-blue-500/30 bg-blue-500/10 px-4 py-2 rounded-lg backdrop-blur-md">
          ← Back to Encyclopedia
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Relic Set Effect */}
          <div className="bg-[#141A29]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
              Set Effect: {relic.setName}
            </h2>
            
            <div className="space-y-6">
              {setEffect && setEffect.desc ? (
                setEffect.desc.map((desc: string, idx: number) => {
                  const pieceRequirement = (idx + 1) * 2; // Usually 2-piece and 4-piece
                  return (
                    <div key={idx} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="shrink-0 bg-gradient-to-br from-blue-600 to-blue-900 text-blue-100 px-4 py-2 rounded-lg flex items-center justify-center font-black text-md shadow-lg border border-blue-500/30">
                        {pieceRequirement}-Piece
                      </div>
                      <div className="flex-1 mt-1">
                        <div className="text-md text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 italic text-center py-8">No set effect data available. Please re-run seed.</div>
              )}
            </div>
          </div>

          {/* Relic RNG Affixes */}
          <div className="bg-[#141A29]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 mb-6 pb-4">
              <h2 className="text-2xl font-bold text-white">Potential Stats</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">Lv. {level}</span>
                <input type="range" min="0" max="15" value={level} onChange={(e) => setLevel(parseInt(e.target.value))} className="w-32 accent-yellow-500 cursor-pointer" />
              </div>
            </div>
            
            <div className="space-y-6">
              
              {/* Main Stats */}
              {staticData.mainAffixes?.affixes && (
                <div>
                  <h3 className="text-sm font-black uppercase text-yellow-500 mb-3">Possible Main Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(staticData.mainAffixes.affixes).map((affix: any, idx: number) => {
                      const isRatio = affix.property.includes('Ratio') || affix.property.includes('Base');
                      const statName = affix.property.replace('Delta', '').replace('AddedRatio', '%').replace('Base', '%');
                      
                      // Formatting logic: ratio is multiplied by 100 for percentage
                      const multiplier = isRatio ? 100 : 1;
                      const calculatedValue = calcStat(affix.base * multiplier, affix.step * multiplier);

                      return (
                        <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors">
                          <span className="text-gray-300 text-sm font-medium">{statName}</span>
                          <span className="text-white font-black">{calculatedValue}{isRatio ? '%' : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub Stats */}
              {staticData.subAffixes?.affixes && (
                <div>
                  <h3 className="text-sm font-black uppercase text-blue-400 mb-3">Possible Sub Stats (Gacha)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(staticData.subAffixes.affixes).map((affix: any, idx: number) => {
                      const statName = affix.property.replace('Delta', '').replace('AddedRatio', '%').replace('Base', '%');
                      return (
                        <div key={idx} className="bg-black/30 p-2 rounded border border-white/5 flex justify-between items-center text-xs">
                          <span className="text-gray-300 font-medium">{statName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        /* HSR HTML tags injection style fixes */
        .text-md unbreak { font-weight: bold; color: #60A5FA; }
        .text-md i { font-style: italic; color: #9CA3AF; }
        .text-md b { font-weight: bold; color: #FBBF24; }
      `}} />
    </main>
  );
}
