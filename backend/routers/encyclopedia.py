from fastapi import APIRouter, HTTPException
from prisma import Prisma

router = APIRouter(
    prefix="/api/encyclopedia",
    tags=["encyclopedia"]
)

@router.get("/{category}/{item_id}")
async def get_encyclopedia_item(category: str, item_id: str):
    """
    Get detailed data for a specific encyclopedia item.
    """
    prisma = Prisma()
    await prisma.connect()
    
    try:
        if category == "characters":
            item = await prisma.character.find_unique(where={"id": item_id})
        elif category == "relics":
            item = await prisma.relic.find_unique(where={"id": item_id})
        elif category == "lightcones":
            item = await prisma.lightcone.find_unique(where={"id": item_id})
        elif category == "items":
            item = await prisma.item.find_unique(where={"id": item_id})
        elif category == "achievements":
            item = await prisma.achievement.find_unique(where={"id": item_id})
        elif category == "avatars":
            item = await prisma.avatar.find_unique(where={"id": item_id})
        elif category == "archive":
            item = await prisma.archivedata.find_unique(where={"id": item_id})
        else:
            raise HTTPException(status_code=404, detail="Category not found")
            
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
            
        return item
    finally:
        await prisma.disconnect()

@router.get("/{category}")
async def get_encyclopedia_data(category: str):
    """
    Get data for a specific encyclopedia category.
    """
    prisma = Prisma()
    await prisma.connect()
    
    try:
        if category == "characters":
            return await prisma.character.find_many(order={"rarity": "desc"})
        elif category == "relics":
            return await prisma.relic.find_many(order={"rarity": "desc"})
        elif category == "lightcones":
            return await prisma.lightcone.find_many(order={"rarity": "desc"})
        elif category == "items":
            return await prisma.item.find_many(take=500) # limit items to prevent huge payload
        elif category == "achievements":
            return await prisma.achievement.find_many(take=500)
        elif category == "avatars":
            return await prisma.avatar.find_many(take=100)
        elif category == "archive":
            return await prisma.archivedata.find_many(take=1000)
        else:
            raise HTTPException(status_code=404, detail="Category not found")
    finally:
        await prisma.disconnect()
