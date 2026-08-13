'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';

export default function ProfileSearchPage() {
  const [uid, setUid] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (uid.trim().length === 9) {
      router.push(`/profile/${uid.trim()}`);
    } else {
      alert('UID Honkai Star Rail harus terdiri dari 9 digit angka.');
    }
  };

  return (
    <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
      <GlassCard className="w-full max-w-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Pencarian UID</h1>
        <p className="text-gray-400 mb-8">
          Masukkan UID Honkai: Star Rail Anda untuk melihat statistik karakter dan Relik (pastikan profil Anda bersifat publik).
        </p>

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <input
            type="number"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Contoh: 800123456"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-hsr-gold transition-colors text-center text-xl tracking-widest"
            maxLength={9}
          />
          <button
            type="submit"
            className="w-full bg-hsr-gold text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-hsr-gold/20"
          >
            Cari Profil
          </button>
        </form>
      </GlassCard>
    </main>
  );
}
