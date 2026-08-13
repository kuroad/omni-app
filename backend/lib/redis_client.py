import os
import redis.asyncio as redis
from dotenv import load_dotenv

load_dotenv()

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

# Create a global Redis pool
redis_client = redis.from_url(redis_url, decode_responses=True)

async def get_cache(key: str) -> str | None:
    try:
        return await redis_client.get(key)
    except Exception as e:
        print(f"Redis GET Error: {e}")
        return None

async def set_cache(key: str, value: str, ttl_seconds: int = 600) -> bool:
    try:
        await redis_client.setex(key, ttl_seconds, value)
        return True
    except Exception as e:
        print(f"Redis SET Error: {e}")
        return False
