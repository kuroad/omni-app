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
    let parsed: string[] | null = null;
    try {
      parsed = JSON.parse(item.desc);
    } catch { /* empty */ }
    
    if (parsed) {
      desc = (
        <ul className="list-disc pl-4 space-y-1">
          {parsed.map((d: string, i: number) => <li key={i}>{d}</li>)}
        </ul>
      );
    }
  } else if (typeof desc === 'string') {
    // Remove weird html tags if any from raw data
    desc = desc.replace(/<[^>]*>?/gm, '');
  }

  return (
    <GlassCard className="h-full flex flex-col group hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300">
      <div className="flex gap-5 items-start mb-4">
        <div className="w-12 h-12 bg-gradient-to-tr from-[#161F33] to-[#7856B7] rounded-lg flex items-center justify-center p-[1px] shrink-0 overflow-hidden shadow-lg group-hover:shadow-[0_0_15px_rgba(120,86,183,0.5)] transition-shadow">
          <div className="w-full h-full bg-[#0B0F19] rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg text-white group-hover:gold-gradient-text transition-all">{item.name?.charAt(0) || item.title?.charAt(0)}</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold leading-tight group-hover:gold-gradient-text transition-all text-lg">{item.name || item.title}</h3>
          {item.rarity && <div className="text-[var(--color-hsr-gold)] text-xs tracking-widest mt-1">{Array(item.rarity).fill('★').join('')}</div>}
          {item.pathId && <div className="glass-pill mt-2 inline-block border-[var(--color-hsr-gold)]/30 text-[var(--color-hsr-gold)]">{item.pathId}</div>}
        </div>
      </div>
      <div className="text-sm text-gray-300/80 flex-1 overflow-y-auto custom-scrollbar pr-2 leading-relaxed">
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
    <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24 glass-panel p-4">
            <h2 className="text-sm font-bold mb-4 text-[var(--color-hsr-gold)] tracking-[0.2em] uppercase px-4">Kategori Omni</h2>
            <div className="space-y-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                    activeTab.id === tab.id 
                      ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  {activeTab.id === tab.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-hsr-gold)] shadow-[0_0_10px_var(--color-hsr-gold)]" />
                  )}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 tracking-tight">{activeTab.label}</h1>
              <p className="text-[var(--color-hsr-gold)] text-sm tracking-widest uppercase">Database Ensiklopedia</p>
            </div>
            <div className="relative w-full max-w-xs">
              <input 
                type="text" 
                placeholder={`Cari ${activeTab.label}...`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-10 py-2.5 text-white focus:outline-none focus:border-[var(--color-hsr-gold)] focus:bg-white/10 transition-all placeholder-gray-500 shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-500" />
            </div>
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
