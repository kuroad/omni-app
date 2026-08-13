import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Default port for Redis is 6379. 
// Uses REDIS_URL from env if available (e.g., from Docker Compose)
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export default redis;
