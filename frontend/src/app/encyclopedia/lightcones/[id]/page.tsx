'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

export default function LightConeWikiPage({ params }: PageProps) {
  const { data: lc, isLoading, isError } = useQuery({
    queryKey: ['encyclopedia', 'lightcone', params.id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/encyclopedia/lightcones/${params.id}`);
      if (!res.ok) throw new Error('Light Cone not found');
      return res.json();
    },
  });

  const [level, setLevel] = useState(80);

  if (isLoading) {
    return <div className="text-white text-center py-20 text-xl animate-pulse">Loading Archive Data...</div>;
  }

  if (isError || !lc) {
    return <div className="text-white text-center py-20 text-2xl">404 - Light Cone Not Found in Archive</div>;
  }

  // Parse static data
  let staticData: any = {};
  if (lc.staticData) {
    staticData = typeof lc.staticData === 'string' ? JSON.parse(lc.staticData) : lc.staticData;
  }
  
  const skill = staticData.skill;

  // Kalkulasi fase ascension
  let phase = 0;
  if (level >= 70) phase = 6;
  else if (level >= 60) phase = 5;
  else if (level >= 50) phase = 4;
  else if (level >= 40) phase = 3;
  else if (level >= 30) phase = 2;
  else if (level >= 20) phase = 1;

  const currentPromo = staticData.promotions?.values?.[phase];

  const calcStat = (statObj: any) => {
    if (!statObj) return 0;
    return Math.floor(statObj.base + statObj.step * (level - 1));
  };

  const parseDesc = (desc: string, params: number[]) => {
    if (!desc || !params || params.length === 0) return desc;
    return desc.replace(/#(\d+)\[(.*?)\](%?)/g, (match, idxStr, type, percentSign) => {
      const idx = parseInt(idxStr) - 1;
      if (idx < 0 || idx >= params.length) return match;
      let val = params[idx];
      if (percentSign === '%') {
        val = val * 100;
        return parseFloat(val.toFixed(2)) + '%';
      } else {
        return parseFloat(val.toFixed(2));
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-gray-100">
      {/* Hero Header */}
      <div className="relative w-full min-h-[500px] overflow-hidden flex items-center">
        {/* Blurred Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: `url(https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${lc.portrait})`,
               backgroundPosition: 'center 20%', backgroundSize: 'cover', filter: 'blur(40px)' 
             }} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row items-center pt-24 pb-12 gap-8 md:gap-16">
          {/* Sisi Kiri: Splash Art */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img 
              src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${lc.portrait}`}
              className="w-full max-w-lg md:max-w-xl object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.15)] pointer-events-none"
            />
          </div>

          {/* Sisi Kanan: Teks Info */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              <span className="bg-black/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-lg text-sm font-bold">
                 {lc.path}
              </span>
              <span className="bg-yellow-500/20 text-yellow-500 px-5 py-2 rounded-full border border-yellow-500/30 shadow-lg text-sm font-black">
                 {lc.rarity}★
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl tracking-tighter leading-tight mb-4">
              {lc.name}
            </h1>
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 mx-auto md:mx-0" />
            <div className="text-gray-300 text-sm md:text-base max-w-lg bg-black/40 p-4 rounded-xl border border-white/10" dangerouslySetInnerHTML={{ __html: lc.desc }} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 relative z-20">
        
        <Link href="/encyclopedia" className="inline-block text-blue-400 hover:text-blue-300 transition-colors font-medium border border-blue-500/30 bg-blue-500/10 px-4 py-2 rounded-lg backdrop-blur-md">
          ← Back to Encyclopedia
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Base Stats */}
          <div className="bg-[#141A29]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 mb-6 pb-4">
              <h2 className="text-2xl font-bold text-white">Dynamic Base Stats</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Lv. {level}</span>
                <input type="range" min="1" max="80" value={level} onChange={(e) => setLevel(parseInt(e.target.value))} className="w-32 accent-blue-500 cursor-pointer" />
              </div>
            </div>
            {currentPromo ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center transition-all">
                  <div className="text-gray-400 font-medium">HP</div>
                  <div className="text-2xl font-black text-white">{calcStat(currentPromo.hp)}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center transition-all">
                  <div className="text-gray-400 font-medium">ATK</div>
                  <div className="text-2xl font-black text-white">{calcStat(currentPromo.atk)}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center transition-all">
                  <div className="text-gray-400 font-medium">DEF</div>
                  <div className="text-2xl font-black text-white">{calcStat(currentPromo.def)}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">No base stats available.</div>
            )}
          </div>

          {/* Light Cone Ability */}
          <div className="bg-[#141A29]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
              <img src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${lc.icon}`} className="w-10 h-10 rounded-full bg-black/50 border border-white/20" />
              Ability: {skill ? skill.name : "Unknown"}
            </h2>
            
            <div className="space-y-6">
              {skill && [1,2,3,4,5].map((sLevel) => {
                const p = skill.params[sLevel - 1] || [];
                const parsedDesc = parseDesc(skill.desc, p);
                return (
                  <div key={sLevel} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="shrink-0 bg-gradient-to-br from-yellow-600 to-yellow-900 text-yellow-100 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(202,138,4,0.3)]">
                      S{sLevel}
                    </div>
                    <div className="flex-1 mt-2">
                      <div className="text-sm text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: parsedDesc }} />
                    </div>
                  </div>
                );
              })}
              {!skill && <div className="text-gray-500 italic text-center py-8">No skill data available. Please re-run seed.</div>}
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        /* HSR HTML tags injection style fixes */
        .text-sm unbreak { font-weight: bold; color: #60A5FA; }
        .text-sm i { font-style: italic; color: #9CA3AF; }
        .text-sm b { font-weight: bold; color: #FBBF24; }
      `}} />
    </main>
  );
}
