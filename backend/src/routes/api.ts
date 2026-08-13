import { FastifyInstance } from 'fastify';
import redis from '../services/redis';
import { fetchAndCleanProfile } from '../services/mihomo';

export default async function apiRoutes(fastify: FastifyInstance) {
  
  // Endpoint untuk mengambil Profile User berdasarkan UID
  fastify.get('/user/:uid', async (request, reply) => {
    const { uid } = request.params as { uid: string };
    
    // Validasi dasar panjang UID HSR (biasanya 9 digit)
    if (!uid || uid.length !== 9) {
      return reply.code(400).send({ error: { message: 'Format UID tidak valid', code: 'INVALID_UID' } });
    }

    try {
      const cacheKey = `profile:${uid}`;
      const cached = await redis.get(cacheKey);
      
      // Jika data ada di Redis (Cache Hit)
      if (cached) {
        return reply.send({ data: JSON.parse(cached), source: 'cache' });
      }

      // Jika data tidak ada (Cache Miss) -> Panggil Mihomo
      const profileData = await fetchAndCleanProfile(uid);
      
      // Simpan ke Redis dengan TTL 600 detik (10 menit)
      await redis.set(cacheKey, JSON.stringify(profileData), 'EX', 600);
      
      return reply.send({ data: profileData, source: 'api' });
    } catch (error: any) {
      fastify.log.error(error);
      
      const msg = error.message;
      if (msg === 'UID not found') {
        return reply.code(404).send({ error: { message: 'UID tidak ditemukan atau tidak tersedia publik', code: 'NOT_FOUND' } });
      }
      
      return reply.code(502).send({ error: { message: 'Mihomo API Timeout / Rate Limited', code: 'UPSTREAM_ERROR' } });
    }
  });

  // --- ENSISKLOPEDIA ENDPOINTS ---
  
  const setupCachedRoute = (route: string, cacheKey: string, dbCall: (prisma: any) => Promise<any>) => {
    fastify.get(route, async (request, reply) => {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) return reply.send({ data: JSON.parse(cached), source: 'cache' });

        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        
        const data = await dbCall(prisma);
        
        await redis.set(cacheKey, JSON.stringify(data), 'EX', 86400); // Cache 24h
        await prisma.$disconnect();
        return reply.send({ data, source: 'db' });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: { message: 'Database error', code: 'DB_ERROR' } });
      }
    });
  };

  setupCachedRoute('/characters', 'encyclopedia:characters', (prisma) => 
    prisma.character.findMany({ include: { path: true, element: true }, orderBy: { name: 'asc' } })
  );

  setupCachedRoute('/lightcones', 'encyclopedia:lightcones', (prisma) => 
    prisma.lightCone.findMany({ include: { path: true }, orderBy: { rarity: 'desc' } })
  );

  setupCachedRoute('/relics', 'encyclopedia:relics', (prisma) => 
    prisma.relicSet.findMany({ orderBy: { name: 'asc' } })
  );

  setupCachedRoute('/items', 'encyclopedia:items', (prisma) => 
    prisma.item.findMany({ orderBy: { rarity: 'desc' } })
  );

  setupCachedRoute('/achievements', 'encyclopedia:achievements', (prisma) => 
    prisma.achievement.findMany({ orderBy: { title: 'asc' } })
  );

  setupCachedRoute('/simulated/blessings', 'encyclopedia:blessings', (prisma) => 
    prisma.simulatedBlessing.findMany({ orderBy: { name: 'asc' } })
  );

  setupCachedRoute('/simulated/curios', 'encyclopedia:curios', (prisma) => 
    prisma.simulatedCurio.findMany({ orderBy: { name: 'asc' } })
  );
}
