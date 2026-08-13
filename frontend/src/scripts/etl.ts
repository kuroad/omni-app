import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const BASE_URL = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/id';

async function fetchJSON(file: string) {
  const res = await fetch(`${BASE_URL}/${file}`);
  if (!res.ok) throw new Error(`Failed to fetch ${file}`);
  const data = await res.json();
  return Object.values(data) as any[];
}

export async function runStaticDataETL() {
  console.log('🚀 Memulai proses OMNI-ETL (Ensiklopedia Segala Hal)...');
  
  try {
    console.log('1. Mengunduh data masif dari StarRailRes...');
    const [
      characters, lightCones, relicSets, relics, items,
      achievements, blessings, curios
    ] = await Promise.all([
      fetchJSON('characters.json'),
      fetchJSON('light_cones.json'),
      fetchJSON('relic_sets.json'),
      fetchJSON('relics.json'),
      fetchJSON('items.json'),
      fetchJSON('achievements.json'),
      fetchJSON('simulated_blessings.json'),
      fetchJSON('simulated_curios.json')
    ]);

    console.log('2. Menyimpan Karakter, Path, dan Elemen...');
    for (const c of characters) {
      if (c.path) {
        await prisma.path.upsert({ where: { id: c.path }, update: {}, create: { id: c.path, name: c.path } });
      }
      if (c.element) {
        await prisma.element.upsert({ where: { id: c.element }, update: {}, create: { id: c.element, name: c.element } });
      }
      await prisma.character.upsert({
        where: { id: String(c.id) },
        update: { name: c.name, rarity: c.rarity, pathId: c.path, elementId: c.element },
        create: { id: String(c.id), name: c.name, rarity: c.rarity, pathId: c.path, elementId: c.element }
      });
    }

    console.log('3. Menyimpan Light Cones...');
    for (const lc of lightCones) {
      if (lc.path) {
        await prisma.path.upsert({ where: { id: lc.path }, update: {}, create: { id: lc.path, name: lc.path } });
      }
      await prisma.lightCone.upsert({
        where: { id: String(lc.id) },
        update: { name: lc.name, rarity: lc.rarity, pathId: lc.path, desc: lc.desc, icon: lc.icon },
        create: { id: String(lc.id), name: lc.name, rarity: lc.rarity, pathId: lc.path, desc: lc.desc, icon: lc.icon }
      });
    }

    console.log('4. Menyimpan Relic Sets & Relics...');
    for (const rs of relicSets) {
      await prisma.relicSet.upsert({
        where: { id: String(rs.id) },
        update: { name: rs.name, desc: JSON.stringify(rs.desc), icon: rs.icon },
        create: { id: String(rs.id), name: rs.name, desc: JSON.stringify(rs.desc), icon: rs.icon }
      });
    }
    for (const r of relics) {
      // Ensure RelicSet exists (some relics might be orphaned in raw data)
      const setExists = await prisma.relicSet.findUnique({ where: { id: String(r.set_id) } });
      if (setExists) {
        await prisma.relic.upsert({
          where: { id: String(r.id) },
          update: { name: r.name, setId: String(r.set_id), icon: r.icon },
          create: { id: String(r.id), name: r.name, setId: String(r.set_id), icon: r.icon }
        });
      }
    }

    console.log('5. Menyimpan Items / Material...');
    for (const i of items) {
      await prisma.item.upsert({
        where: { id: String(i.id) },
        update: { name: i.name, type: i.type, subType: i.sub_type, rarity: i.rarity, icon: i.icon },
        create: { id: String(i.id), name: i.name, type: i.type, subType: i.sub_type, rarity: i.rarity, icon: i.icon }
      });
    }

    console.log('6. Menyimpan Achievements...');
    for (const a of achievements) {
      await prisma.achievement.upsert({
        where: { id: String(a.id) },
        update: { seriesId: String(a.series_id), title: a.title, desc: a.desc, hide: Boolean(a.hide) },
        create: { id: String(a.id), seriesId: String(a.series_id), title: a.title, desc: a.desc, hide: Boolean(a.hide) }
      });
    }

    console.log('7. Menyimpan Simulated Universe (Blessings & Curios)...');
    for (const b of blessings) {
      await prisma.simulatedBlessing.upsert({
        where: { id: String(b.id) },
        update: { name: b.name, desc: b.desc, enhancedDesc: b.enhanced_desc },
        create: { id: String(b.id), name: b.name, desc: b.desc, enhancedDesc: b.enhanced_desc }
      });
    }
    for (const cu of curios) {
      await prisma.simulatedCurio.upsert({
        where: { id: String(cu.id) },
        update: { name: cu.name, desc: cu.desc, bgDesc: cu.bg_desc, icon: cu.icon },
        create: { id: String(cu.id), name: cu.name, desc: cu.desc, bgDesc: cu.bg_desc, icon: cu.icon }
      });
    }

    console.log('✅ OMNI-ETL selesai! Database sudah terisi penuh.');
  } catch (error) {
    console.error('❌ Gagal menjalankan OMNI-ETL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  runStaticDataETL();
}
