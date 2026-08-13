'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCharacters } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { EncyclopediaCard } from '@/components/ui/EncyclopediaCard';

const ELEMENTS = ['Semua', 'Physical', 'Fire', 'Ice', 'Lightning', 'Wind', 'Quantum', 'Imaginary'];

export default function EncyclopediaPage() {
  const [selectedElement, setSelectedElement] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: characters = [], isLoading, error } = useQuery({
    queryKey: ['characters'],
    queryFn: () => getCharacters(),
  });

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-hsr-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-hsr-gold animate-pulse">Mengakses Database Astral Express...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
        <GlassCard className="max-w-md w-full text-center p-8 border border-red-500/30">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Akses Ditolak</h2>
          <p className="text-gray-300">Gagal mengambil data statis karakter dari server.</p>
        </GlassCard>
      </main>
    );
  }

  // Filter Logic
  const filteredCharacters = characters.filter((c: any) => {
    const matchElement = selectedElement === 'Semua' || c.elementId === selectedElement;
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchElement && matchSearch;
  });

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Ensiklopedia Karakter</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Database komprehensif seluruh Karakter Honkai: Star Rail yang disinkronkan langsung dengan repositori publik.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        {/* Search Input */}
        <input 
          type="text" 
          placeholder="Cari karakter (misal: Acheron)" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-hsr-gold transition-colors"
        />

        {/* Element Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {ELEMENTS.map(el => (
            <button
              key={el}
              onClick={() => setSelectedElement(el)}
              className={`px-3 py-1 text-sm font-semibold rounded-full border transition-colors ${
                selectedElement === el 
                  ? 'bg-hsr-gold text-black border-hsr-gold' 
                  : 'bg-black/30 border-white/20 text-gray-300 hover:border-hsr-gold'
              }`}
            >
              {el}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCharacters.length > 0 ? (
          filteredCharacters.map((char: any) => (
            <EncyclopediaCard key={char.id} character={char} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            Tidak ada karakter yang cocok dengan filter.
          </div>
        )}
      </div>
    </main>
  );
}
