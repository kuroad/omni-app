import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { fetchAndCleanProfile } from '@/lib/mihomo';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const resolvedParams = await params;
  const { uid } = resolvedParams;

  if (!uid || uid.length !== 9) {
    return NextResponse.json(
      { error: { message: 'Format UID tidak valid', code: 'INVALID_UID' } },
      { status: 400 }
    );
  }

  try {
    const cacheKey = `profile:${uid}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return NextResponse.json({ data: JSON.parse(cached), source: 'cache' });
    }

    const profileData = await fetchAndCleanProfile(uid);

    await redis.set(cacheKey, JSON.stringify(profileData), 'EX', 600);

    return NextResponse.json({ data: profileData, source: 'api' });
  } catch (error: any) {
    console.error('Mihomo API Error:', error);

    const msg = error.message;
    if (msg === 'UID not found') {
      return NextResponse.json(
        { error: { message: 'UID tidak ditemukan atau tidak tersedia publik', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: { message: 'Mihomo API Timeout / Rate Limited', code: 'UPSTREAM_ERROR' } },
      { status: 502 }
    );
  }
}
