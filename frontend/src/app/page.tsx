import { GlassCard } from '@/components/ui/GlassCard';
import { BadgeElement } from '@/components/ui/BadgeElement';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          Omni-Ensiklopedia <span className="text-hsr-gold">HSR</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Database komprehensif Honkai: Star Rail. Telusuri profil UID, statistik karakter, dan skor Relik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/profile" className="block w-full">
          <GlassCard tiltOnHover className="h-64 cursor-pointer">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-2xl font-semibold mb-2">Pencarian UID</h2>
              <p className="text-sm text-gray-400 mb-6">Lihat status karakter dan skor Relik Anda.</p>
              <div className="flex gap-3">
                <BadgeElement element="Quantum" />
                <BadgeElement element="Imaginary" />
              </div>
            </div>
          </GlassCard>
        </Link>

        <Link href="/encyclopedia" className="block w-full">
          <GlassCard tiltOnHover className="h-64 cursor-pointer">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-2xl font-semibold mb-2">Ensiklopedia</h2>
              <p className="text-sm text-gray-400 mb-6">Eksplorasi Lore, Light Cone, dan Relik.</p>
              <div className="flex gap-3">
                <BadgeElement element="Fire" />
                <BadgeElement element="Ice" />
                <BadgeElement element="Lightning" />
              </div>
            </div>
          </GlassCard>
        </Link>
      </div>
    </main>
  );
}
