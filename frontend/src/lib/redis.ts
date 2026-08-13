import Redis from 'ioredis';

const globalForRedis = global as unknown as { redis: Redis };

let redis: Redis;

if (process.env.NODE_ENV === 'production') {
  redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
} else {
  if (!globalForRedis.redis) {
    globalForRedis.redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
  }
  redis = globalForRedis.redis;
}

export default redis;
