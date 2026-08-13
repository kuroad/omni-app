'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { CharacterCard } from '@/components/ui/CharacterCard';
import { RelicScoreCard } from '@/components/ui/RelicScoreCard';

export default function ProfileResultPage({ params }: { params: { uid: string } }) {
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', params.uid],
    queryFn: () => getProfile(params.uid),
    retry: 1
  });

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-hsr-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-hsr-gold animate-pulse">Menghubungkan ke Astral Express...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
        <GlassCard className="max-w-md w-full text-center p-8 border border-red-500/30">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Pencarian Gagal</h2>
          <p className="text-gray-300">{(error as Error)?.message || 'UID tidak ditemukan atau sedang diproses.'}</p>
        </GlassCard>
      </main>
    );
  }

  // Auto-select first character
  const activeCharId = selectedCharId || (data.characters.length > 0 ? data.characters[0].id : null);
  const activeChar = data.characters.find(c => c.id === activeCharId);

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Player Header */}
      <GlassCard className="flex flex-col md:flex-row items-center gap-8 mb-12 p-8">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border-4 border-hsr-gold overflow-hidden shrink-0">
          <span className="text-4xl font-bold">{data.nickname.charAt(0)}</span>
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-bold mb-2">{data.nickname}</h1>
          <p className="text-hsr-gold font-mono tracking-widest mb-2">UID: {data.uid}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
            <span className="bg-white/10 px-3 py-1 rounded-full">Lv. {data.level}</span>
          </div>
        </div>
        <div className="text-center md:text-right text-gray-400 italic max-w-sm">
          &quot;{data.signature || 'Tidak ada deskripsi'}&quot;
        </div>
      </GlassCard>

      {data.characters.length === 0 ? (
        <div className="text-center text-gray-400">Tidak ada data karakter yang dibagikan secara publik.</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Character List Sidebar */}
          <div className="w-full lg:w-1/3 space-y-4">
            <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-2">Karakter Showcase</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {data.characters.map(char => (
                <CharacterCard 
                  key={char.id} 
                  character={char} 
                  isSelected={char.id === activeCharId}
                  onClick={() => setSelectedCharId(char.id)}
                />
              ))}
            </div>
          </div>

          {/* Relics Detail Panel */}
          <div className="w-full lg:w-2/3">
            {activeChar && (
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/20 pb-2">
                  <h2 className="text-2xl font-bold">Relik: <span className="text-hsr-gold">{activeChar.name}</span></h2>
                </div>
                
                {activeChar.relics.length === 0 ? (
                  <p className="text-gray-400 italic">Karakter ini belum menggunakan Relik apapun.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {activeChar.relics.map(relic => (
                      <RelicScoreCard key={relic.id} relic={relic} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
