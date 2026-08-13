'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function Home() {
  const [uid, setUid] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (uid.trim().length === 9) {
      router.push(`/profile/${uid}`);
    } else {
      alert("Please enter a valid 9-digit UID.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decorative Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 text-center space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Omni-App</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
          Your ultimate Honkai: Star Rail companion. View detailed trailblazer profiles, analyze relic scores, and explore the complete astral encyclopedia.
        </p>

        <form onSubmit={handleSearch} className="mt-8 relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-32 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all backdrop-blur-md shadow-2xl"
            placeholder="Enter your 9-digit UID..."
            maxLength={9}
          />
          <button 
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 rounded-full transition-colors"
          >
            Warp
          </button>
        </form>

        <div className="mt-12 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>Powered by Next.js 14</span>
          <span>•</span>
          <span>FastAPI</span>
          <span>•</span>
          <span>Prisma Python</span>
        </div>
      </div>
    </main>
  );
}
