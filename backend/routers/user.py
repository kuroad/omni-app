import json
from fastapi import APIRouter, HTTPException
from lib.mihomo import fetch_mihomo_data, clean_mihomo_data
from lib.redis_client import get_cache, set_cache

router = APIRouter(
    prefix="/api/user",
    tags=["user"]
)

@router.get("/{uid}")
async def get_user_profile(uid: str):
    """
    Get user profile and characters showcase by UID.
    Implements Redis caching to prevent Mihomo API rate limiting.
    """
    if not uid.isdigit() or len(uid) != 9:
        raise HTTPException(status_code=400, detail="Invalid UID format. Must be 9 digits.")

    cache_key = f"omni:user:{uid}"
    
    # 1. Check Redis Cache
    cached_data = await get_cache(cache_key)
    if cached_data:
        return json.loads(cached_data)
        
    # 2. Fetch from Mihomo API
    raw_data = await fetch_mihomo_data(uid)
    if not raw_data:
        raise HTTPException(status_code=404, detail="User not found or Mihomo API is down")
        
    # 3. Clean and format the data
    cleaned_data = clean_mihomo_data(raw_data)
    
    # 4. Save to Redis Cache (TTL 10 minutes)
    await set_cache(cache_key, json.dumps(cleaned_data), ttl_seconds=600)
    
    return cleaned_data
