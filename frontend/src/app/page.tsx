import { GlassCard } from '@/components/ui/GlassCard';
import { BadgeElement } from '@/components/ui/BadgeElement';

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
        <GlassCard tiltOnHover className="flex flex-col items-center justify-center h-64 text-center cursor-pointer">
          <h2 className="text-2xl font-semibold mb-2">Pencarian UID</h2>
          <p className="text-sm text-gray-400 mb-4">Lihat status karakter dan skor Relik Anda.</p>
          <div className="flex gap-2 mt-4">
            <BadgeElement element="Quantum" />
            <BadgeElement element="Imaginary" />
          </div>
        </GlassCard>

        <GlassCard tiltOnHover className="flex flex-col items-center justify-center h-64 text-center cursor-pointer">
          <h2 className="text-2xl font-semibold mb-2">Ensiklopedia</h2>
          <p className="text-sm text-gray-400 mb-4">Eksplorasi Lore, Light Cone, dan Relik.</p>
          <div className="flex gap-2 mt-4">
            <BadgeElement element="Fire" />
            <BadgeElement element="Ice" />
            <BadgeElement element="Lightning" />
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
