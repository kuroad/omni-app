'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOmniData } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { EncyclopediaCard } from '@/components/ui/EncyclopediaCard';

const TABS = [
  { id: 'characters', label: 'Karakter', endpoint: 'characters' },
  { id: 'lightcones', label: 'Light Cones', endpoint: 'lightcones' },
  { id: 'relics', label: 'Relik', endpoint: 'relics' },
  { id: 'items', label: 'Material & Item', endpoint: 'items' },
  { id: 'achievements', label: 'Pencapaian', endpoint: 'achievements' },
  { id: 'blessings', label: 'SU: Blessings', endpoint: 'simulated/blessings' },
  { id: 'curios', label: 'SU: Curios', endpoint: 'simulated/curios' },
];

function GenericCard({ item, tabId }: { item: any, tabId: string }) {
  if (tabId === 'characters') return <EncyclopediaCard character={item} />;

  let desc = item.desc;
  if (tabId === 'relics' && typeof item.desc === 'string') {
    try {
      const parsed = JSON.parse(item.desc);
      desc = (
        <ul className="list-disc pl-4 space-y-1">
          {parsed.map((d: string, i: number) => <li key={i}>{d}</li>)}
        </ul>
      );
    } catch { /* empty */ }
  } else if (typeof desc === 'string') {
    // Remove weird html tags if any from raw data
    desc = desc.replace(/<[^>]*>?/gm, '');
  }

  return (
    <GlassCard className="h-full flex flex-col hover:bg-white/5 transition-colors">
      <div className="flex gap-4 items-start mb-3">
        <div className="w-12 h-12 bg-black/40 rounded flex items-center justify-center border border-white/20 shrink-0 overflow-hidden">
          <span className="font-bold text-lg text-gray-300">{item.name?.charAt(0) || item.title?.charAt(0)}</span>
        </div>
        <div>
          <h3 className="font-bold leading-tight">{item.name || item.title}</h3>
          {item.rarity && <div className="text-hsr-gold text-xs tracking-widest">{Array(item.rarity).fill('★').join('')}</div>}
          {item.pathId && <div className="text-xs text-gray-400 mt-1 uppercase">{item.pathId}</div>}
        </div>
      </div>
      <div className="text-sm text-gray-300 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {desc}
      </div>
    </GlassCard>
  );
}

export default function OmniEncyclopediaPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['omni', activeTab.id],
    queryFn: () => fetchOmniData(activeTab.endpoint),
  });

  const filteredData = data.filter((item: any) => {
    const term = searchQuery.toLowerCase();
    const name = (item.name || item.title || '').toLowerCase();
    return name.includes(term);
  });

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-2">
            <h2 className="text-xl font-bold mb-6 text-hsr-gold border-b border-white/10 pb-2">Kategori Omni</h2>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeTab.id === tab.id 
                    ? 'bg-hsr-gold text-black shadow-lg shadow-hsr-gold/20' 
                    : 'bg-black/30 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{activeTab.label}</h1>
            <input 
              type="text" 
              placeholder={`Cari di ${activeTab.label}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-hsr-gold transition-colors"
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-hsr-gold border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-hsr-gold animate-pulse">Menarik data dari database lokal...</p>
            </div>
          ) : error ? (
            <GlassCard className="text-center p-8 border border-red-500/30">
              <h2 className="text-xl font-bold text-red-400 mb-2">Gagal Memuat</h2>
              <p className="text-gray-300">Harap jalankan ETL terlebih dahulu.</p>
            </GlassCard>
          ) : (
            <>
              <div className="text-sm text-gray-400 mb-4">Menampilkan {filteredData.length} hasil</div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredData.map((item: any) => (
                  <GenericCard key={item.id} item={item} tabId={activeTab.id} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
