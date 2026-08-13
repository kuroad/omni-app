'use client';

import { useQuery } from '@tanstack/react-query';
import { EncyclopediaCard } from '@/components/ui/EncyclopediaCard';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'characters', label: 'Characters' },
  { id: 'lightcones', label: 'Light Cones' },
  { id: 'relics', label: 'Relics' },
  { id: 'items', label: 'Materials' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'archive', label: 'Sim. Universe' },
];

export default function EncyclopediaPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("characters");

  const { data, isLoading, isError } = useQuery({
    queryKey: ['encyclopedia', activeTab],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/encyclopedia/${activeTab}`);
      if (!res.ok) throw new Error('Failed to fetch encyclopedia');
      return res.json();
    },
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item: any) => {
      const name = item.name || item.title || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [data, search]);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            Omni-Encyclopedia
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore the vast universe of Honkai: Star Rail. Discover characters, paths, and elements all powered by your local database.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveTab(cat.id); setSearch(""); }}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === cat.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-md"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* State Handling */}
        {isLoading && (
          <div className="text-center py-20 text-blue-400 animate-pulse text-xl">
            Synchronizing with Astral Express Data Bank...
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-red-400 p-8 border border-red-500/30 bg-red-500/10 rounded-2xl backdrop-blur-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Database Connection Lost</h2>
            <p>Ensure your PostgreSQL database is running and the seed script has been executed.</p>
          </div>
        )}

        {/* Grid Data */}
        {!isLoading && !isError && filteredData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {filteredData.map((item: any) => {
              if (activeTab === "characters" || activeTab === "lightcones") {
                // We can reuse EncyclopediaCard but pass a generic object
                const fakeChar = {
                  id: item.id,
                  name: item.name,
                  rarity: item.rarity,
                  path: item.path || "Unknown",
                  element: item.element || "Unknown",
                  preview: item.preview || item.icon,
                  portrait: item.portrait || item.preview || item.icon,
                };
                
                const linkHref = activeTab === "characters" 
                  ? `/encyclopedia/character/${item.id}`
                  : `/encyclopedia/lightcones/${item.id}`;
                  
                return (
                  <Link href={linkHref} key={item.id}>
                    <EncyclopediaCard char={fakeChar} />
                  </Link>
                );
              } else if (activeTab === "achievements") {
                return (
                  <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="font-bold text-yellow-500">{item.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">{item.desc}</p>
                  </div>
                );
              } else if (activeTab === "relics") {
                return (
                  <Link href={`/encyclopedia/relics/${item.id}`} key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors group">
                    {item.icon && (
                      <img src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${item.icon}`} className="w-12 h-12 rounded-full bg-black/50 group-hover:scale-110 transition-transform" />
                    )}
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{item.name}</h3>
                      {item.rarity && <span className="text-xs text-yellow-500">{item.rarity}★ Set</span>}
                    </div>
                  </Link>
                );
              } else if (activeTab === "archive") {
                const categoryColor = item.category === "SimulatedBlessing" ? "text-blue-400" 
                                    : item.category === "SimulatedCurio" ? "text-purple-400" 
                                    : "text-green-400";
                return (
                  <Link href={`/encyclopedia/archive/${item.id}`} key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors group">
                    {item.icon && (
                      <img src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${item.icon}`} className="w-12 h-12 rounded-full bg-black/50 group-hover:scale-110 transition-transform" />
                    )}
                    <div>
                      <h3 className="font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">{item.name}</h3>
                      <span className={`text-xs font-bold uppercase ${categoryColor}`}>
                        {item.category.replace('Simulated', '')}
                      </span>
                    </div>
                  </Link>
                );
              } else {
                return (
                  <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                    {item.icon && (
                      <img src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${item.icon}`} className="w-12 h-12 rounded-full bg-black/50" />
                    )}
                    <div>
                      <h3 className="font-bold text-white">{item.name}</h3>
                      {item.rarity && <span className="text-xs text-yellow-500">{item.rarity}★</span>}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
        
        {!isLoading && filteredData.length === 0 && data && (
          <div className="text-center text-gray-500 py-20">
            No data found matching "{search}"
          </div>
        )}

      </div>
    </main>
  );
}
