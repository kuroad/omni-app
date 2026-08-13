'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

export default function ArchiveDetailPage({ params }: PageProps) {
  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['encyclopedia', 'archive', params.id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/encyclopedia/archive/${params.id}`);
      if (!res.ok) throw new Error('Archive data not found');
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="text-white text-center py-20 text-xl animate-pulse">Loading Archive Data...</div>;
  }

  if (isError || !item) {
    return <div className="text-white text-center py-20 text-2xl">404 - Archive Data Not Found</div>;
  }

  // Parse static data
  let staticData: any = {};
  if (item.staticData) {
    staticData = typeof item.staticData === 'string' ? JSON.parse(item.staticData) : item.staticData;
  }
  
  const categoryLabel = item.category.replace('Simulated', '');
  const categoryColor = item.category === "SimulatedBlessing" ? "from-blue-500 to-blue-900 text-blue-100 border-blue-500/30" 
                      : item.category === "SimulatedCurio" ? "from-purple-500 to-purple-900 text-purple-100 border-purple-500/30" 
                      : "from-green-500 to-green-900 text-green-100 border-green-500/30";

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

  const parsedDesc = parseDesc(staticData.desc, staticData.params || []);
  const parsedEnhancedDesc = parseDesc(staticData.enhanced_desc, staticData.params || []);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-gray-100">
      {/* Hero Header */}
      <div className="relative w-full min-h-[350px] overflow-hidden flex items-center">
        {/* Blurred Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: `url(https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${item.icon})`,
               backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(30px)' 
             }} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
        
        <div className="max-w-4xl mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row items-center pt-24 pb-12 gap-8 md:gap-16">
          {/* Sisi Kiri: Icon */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <img 
              src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${item.icon}`}
              className="w-full max-w-[150px] object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] pointer-events-none rounded-2xl bg-black/50 border-4 border-white/10"
            />
          </div>

          {/* Sisi Kanan: Teks Info */}
          <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <span className={`bg-gradient-to-br ${categoryColor} px-5 py-2 rounded-full border shadow-lg text-sm font-black uppercase`}>
                 {categoryLabel}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl tracking-tighter leading-tight mb-4">
              {item.name}
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 mx-auto md:mx-0" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 relative z-20">
        
        <Link href="/encyclopedia" className="inline-block text-blue-400 hover:text-blue-300 transition-colors font-medium border border-blue-500/30 bg-blue-500/10 px-4 py-2 rounded-lg backdrop-blur-md mb-8">
          ← Back to Encyclopedia
        </Link>

        {/* Data Detail */}
        <div className="bg-[#141A29]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
            Archive Data Effect
          </h2>
          
          <div className="space-y-6">
            {staticData.desc ? (
              <div className="bg-white/5 p-5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                <div className="text-gray-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: parsedDesc }} />
              </div>
            ) : (
              <div className="text-gray-500 italic">No description available for this archive data.</div>
            )}
            
            {staticData.enhanced_desc && (
              <div className="mt-8">
                <h3 className="text-sm font-black uppercase text-blue-400 mb-3 flex items-center gap-2">
                  <span className="text-xl">✨</span> Enhanced Effect
                </h3>
                <div className="bg-blue-900/20 p-5 rounded-xl border border-blue-500/20">
                  <div className="text-blue-200 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: parsedEnhancedDesc }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        /* HSR HTML tags injection style fixes */
        .text-lg unbreak { font-weight: bold; color: #60A5FA; }
        .text-lg i { font-style: italic; color: #9CA3AF; }
        .text-lg b { font-weight: bold; color: #FBBF24; }
      `}} />
    </main>
  );
}
