export default function ProfileResultPage({ params }: { params: { uid: string } }) {
  return (
    <main className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-hsr-gold mb-4">Profil UID: {params.uid}</h1>
      <p className="text-gray-400">
        Halaman Hasil Profil sedang dalam tahap pengembangan (WIP). 
        Sistem akan segera dihubungkan dengan integrasi TanStack Query dan Mihomo API 
        untuk menampilkan skor Relik (CV) Anda.
      </p>
    </main>
  );
}
