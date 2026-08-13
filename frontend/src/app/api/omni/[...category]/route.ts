import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string[] }> }
) {
  const resolvedParams = await params;
  const endpoint = resolvedParams.category.join('/');
  const cacheKey = `encyclopedia:${endpoint.replace('/', '_')}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json({ data: JSON.parse(cached), source: 'cache' });
    }

    let data;
    switch (endpoint) {
      case 'characters':
        data = await prisma.character.findMany({ include: { path: true, element: true }, orderBy: { name: 'asc' } });
        break;
      case 'lightcones':
        data = await prisma.lightCone.findMany({ include: { path: true }, orderBy: { rarity: 'desc' } });
        break;
      case 'relics':
        data = await prisma.relicSet.findMany({ orderBy: { name: 'asc' } });
        break;
      case 'items':
        data = await prisma.item.findMany({ orderBy: { rarity: 'desc' } });
        break;
      case 'achievements':
        data = await prisma.achievement.findMany({ orderBy: { title: 'asc' } });
        break;
      case 'simulated/blessings':
        data = await prisma.simulatedBlessing.findMany({ orderBy: { name: 'asc' } });
        break;
      case 'simulated/curios':
        data = await prisma.simulatedCurio.findMany({ orderBy: { name: 'asc' } });
        break;
      default:
        return NextResponse.json({ error: { message: 'Kategori tidak valid', code: 'INVALID_CATEGORY' } }, { status: 400 });
    }

    await redis.set(cacheKey, JSON.stringify(data), 'EX', 86400); // Cache 24h
    return NextResponse.json({ data, source: 'db' });
  } catch (error) {
    console.error('Encyclopedia API Error:', error);
    return NextResponse.json({ error: { message: 'Database error', code: 'DB_ERROR' } }, { status: 500 });
  }
}
