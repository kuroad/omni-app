import httpx
import json

MIHOMO_BASE_URL = "https://api.mihomo.me/sr_info_parsed"

async def fetch_mihomo_data(uid: str, lang: str = "en") -> dict | None:
    """
    Fetches raw parsed data from Mihomo API for the given UID.
    """
    url = f"{MIHOMO_BASE_URL}/{uid}?lang={lang}"
    headers = {
        "User-Agent": "OmniApp/3.0",
        "Accept": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=10.0)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Mihomo API Error {response.status_code}: {response.text}")
                return None
        except Exception as e:
            print(f"Network error fetching Mihomo data: {e}")
            return None

def clean_mihomo_data(raw_data: dict) -> dict:
    """
    Cleans and formats the raw data from Mihomo into a structured profile object.
    Calculates Relic Crit Value (CV) and assigns a Grade.
    """
    if not raw_data or "player" not in raw_data:
        return {}

    player = raw_data["player"]
    characters_raw = raw_data.get("characters", [])
    
    cleaned_characters = []
    for char in characters_raw:
        cleaned_char = {
            "id": char.get("id"),
            "name": char.get("name"),
            "rarity": char.get("rarity"),
            "level": char.get("level"),
            "element": char.get("element", {}).get("name"),
            "path": char.get("path", {}).get("name"),
            "icon": char.get("icon"),
            "preview": char.get("preview"),
            "portrait": char.get("portrait"),
            "rank": char.get("rank", 0),
            "light_cone": char.get("light_cone"),
            "properties": char.get("properties", []),
            "skills": char.get("skills", []),
            "relics": []
        }
        
        # Extract relics and calculate CV
        for relic in char.get("relics", []):
            sub_stats = relic.get("sub_affix", [])
            
            # Calculate CV
            cv = 0.0
            for sub in sub_stats:
                field = sub.get("field", "")
                val = sub.get("value", 0.0)
                if field == "crit_rate":
                    cv += (val * 100) * 2
                elif field == "crit_dmg":
                    cv += (val * 100)
                    
            # Assign Grade
            grade = "C"
            if cv >= 35:
                grade = "S"
            elif cv >= 25:
                grade = "A"
            elif cv >= 15:
                grade = "B"
                
            cleaned_relic = {
                "id": relic.get("id"),
                "name": relic.get("name"),
                "set_name": relic.get("set_name"),
                "rarity": relic.get("rarity"),
                "level": relic.get("level"),
                "icon": relic.get("icon"),
                "main_stat": relic.get("main_affix", {}),
                "sub_stats": sub_stats,
                "score": {
                    "cv": round(cv, 1),
                    "grade": grade
                }
            }
            cleaned_char["relics"].append(cleaned_relic)
            
        cleaned_characters.append(cleaned_char)
        
    return {
        "uid": player.get("uid"),
        "nickname": player.get("nickname"),
        "level": player.get("level"),
        "signature": player.get("signature"),
        "avatar": player.get("avatar", {}).get("icon"),
        "space_info": player.get("space_info", {}),
        "characters": cleaned_characters
    }
