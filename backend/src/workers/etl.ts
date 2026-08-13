import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

/**
 * Worker ETL (Extract, Transform, Load) 
 * Fungsi ini bertugas menarik raw data statis dari repository (misal: Dimbreath) 
 * dan melakukan normalisasi, lalu menyimpannya ke PostgreSQL via Prisma.
 */
export async function runStaticDataETL() {
  console.log('🚀 Memulai proses sinkronisasi ETL Data Statis HSR...');
  
  try {
    // === 1. EXTRACT ===
    // Simulasi penarikan raw data dari repositori GitHub
    // Praktiknya akan menggunakan raw URL dari file JSON repo terkait
    console.log('Mengambil referensi Path dan Element...');
    const rawPaths = [
      { id: 'Knight', name: 'Preservation' },
      { id: 'Rogue', name: 'The Hunt' },
      { id: 'Mage', name: 'Erudition' },
      { id: 'Warlock', name: 'Nihility' },
      { id: 'Warrior', name: 'Destruction' },
      { id: 'Shaman', name: 'Harmony' },
      { id: 'Priest', name: 'Abundance' },
      { id: 'Joy', name: 'Elation' },
      { id: 'Memory', name: 'Remembrance' }
    ];

    const rawElements = [
      { id: 'Physical', name: 'Physical' },
      { id: 'Fire', name: 'Fire' },
      { id: 'Ice', name: 'Ice' },
      { id: 'Thunder', name: 'Lightning' },
      { id: 'Wind', name: 'Wind' },
      { id: 'Quantum', name: 'Quantum' },
      { id: 'Imaginary', name: 'Imaginary' }
    ];

    // === 2. TRANSFORM & LOAD ===
    console.log('Menyimpan data Path ke PostgreSQL...');
    for (const p of rawPaths) {
      await prisma.path.upsert({
        where: { id: p.id },
        update: { name: p.name },
        create: { id: p.id, name: p.name }
      });
    }

    console.log('Menyimpan data Element ke PostgreSQL...');
    for (const e of rawElements) {
      await prisma.element.upsert({
        where: { id: e.id },
        update: { name: e.name },
        create: { id: e.id, name: e.name }
      });
    }

    console.log('Mengunduh data karakter asli dari repositori StarRailRes...');
    const response = await fetch('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/id/characters.json');
    const data = await response.json();
    const characters = Object.values(data) as any[];

    console.log(`Berhasil mengunduh ${characters.length} karakter. Mulai menyimpan ke PostgreSQL...`);
    for (const c of characters) {
      // Ensure path and element exist to avoid foreign key errors for unexpected data
      await prisma.path.upsert({
        where: { id: c.path },
        update: {},
        create: { id: c.path, name: c.path }
      });
      await prisma.element.upsert({
        where: { id: c.element },
        update: {},
        create: { id: c.element, name: c.element }
      });

      await prisma.character.upsert({
        where: { id: String(c.id) },
        update: {
          name: c.name,
          rarity: c.rarity,
          pathId: c.path,
          elementId: c.element
        },
        create: {
          id: String(c.id),
          name: c.name,
          rarity: c.rarity,
          pathId: c.path,
          elementId: c.element
        }
      });
    }
    
    console.log('✅ Proses ETL Data Asli selesai dengan sukses!');
  } catch (error) {
    console.error('❌ Gagal menjalankan proses ETL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Jika dijalankan langsung sebagai script via cron
if (require.main === module) {
  runStaticDataETL();
}
