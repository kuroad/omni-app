import asyncio
import json
from prisma import Prisma
import httpx

async def fetch_and_seed():
    print("Starting Super Encyclopedia Seeder with Static Data (Data Bank)...")
    prisma = Prisma()
    await prisma.connect()

    base_url = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Fetch Mappings & Extras
        print("Fetching Mappings & Lore Data...")
        res = await asyncio.gather(
            client.get(f"{base_url}/paths.json"),
            client.get(f"{base_url}/elements.json"),
            client.get(f"{base_url}/character_skills.json"),
            client.get(f"{base_url}/character_ranks.json"),
            client.get(f"{base_url}/light_cone_ranks.json"),
            client.get(f"{base_url}/relic_sets.json")
        )
        paths_map = res[0].json() if res[0].status_code == 200 else {}
        elements_map = res[1].json() if res[1].status_code == 200 else {}
        char_skills_map = res[2].json() if res[2].status_code == 200 else {}
        char_ranks_map = res[3].json() if res[3].status_code == 200 else {}
        lc_ranks_map = res[4].json() if res[4].status_code == 200 else {}
        relic_sets_map = res[5].json() if res[5].status_code == 200 else {}

        # 1.5 Fetch Ultimate Archive Data
        print("Fetching Ultimate Archive Data...")
        archive_res = await asyncio.gather(
            client.get(f"{base_url}/character_promotions.json"),
            client.get(f"{base_url}/character_skill_trees.json"),
            client.get(f"{base_url}/light_cone_promotions.json"),
            client.get(f"{base_url}/relic_main_affixes.json"),
            client.get(f"{base_url}/relic_sub_affixes.json"),
            client.get(f"{base_url}/simulated_blessings.json"),
            client.get(f"{base_url}/simulated_curios.json"),
            client.get(f"{base_url}/simulated_events.json")
        )
        char_promotions_map = archive_res[0].json() if archive_res[0].status_code == 200 else {}
        char_skill_trees_map = archive_res[1].json() if archive_res[1].status_code == 200 else {}
        lc_promotions_map = archive_res[2].json() if archive_res[2].status_code == 200 else {}
        relic_main_affixes_map = archive_res[3].json() if archive_res[3].status_code == 200 else {}
        relic_sub_affixes_map = archive_res[4].json() if archive_res[4].status_code == 200 else {}
        su_blessings = archive_res[5].json() if archive_res[5].status_code == 200 else {}
        su_curios = archive_res[6].json() if archive_res[6].status_code == 200 else {}
        su_events = archive_res[7].json() if archive_res[7].status_code == 200 else {}

        # 2. Fetch Core Data
        print("Fetching Core Data...")
        core_res = await asyncio.gather(
            client.get(f"{base_url}/characters.json"),
            client.get(f"{base_url}/relics.json"),
            client.get(f"{base_url}/light_cones.json"),
            client.get(f"{base_url}/items.json"),
            client.get(f"{base_url}/achievements.json"),
            client.get(f"{base_url}/avatars.json")
        )

        # Seed Characters
        if core_res[0].status_code == 200:
            char_data = core_res[0].json()
            for key, char in char_data.items():
                if not char.get("element") or not char.get("path"): continue
                mapped_path = paths_map.get(char["path"], {}).get("name", char["path"])
                mapped_element = elements_map.get(char["element"], {}).get("name", char["element"])
                
                # Assemble staticData
                static_data = {
                    "skills": {sk_id: char_skills_map.get(sk_id) for sk_id in char.get("skills", [])},
                    "ranks": {rk_id: char_ranks_map.get(rk_id) for rk_id in char.get("ranks", [])},
                    "skill_trees": {st_id: char_skill_trees_map.get(st_id) for st_id in char.get("skill_trees", [])},
                    "promotions": char_promotions_map.get(str(char["id"]))
                }
                
                await prisma.character.upsert(
                    where={"id": str(char["id"])},
                    data={
                        "create": {"id": str(char["id"]), "name": char["name"], "rarity": char["rarity"], "path": mapped_path, "element": mapped_element, "icon": char.get("icon", ""), "preview": char.get("preview", ""), "portrait": char.get("portrait", ""), "staticData": json.dumps(static_data)},
                        "update": {"name": char["name"], "rarity": char["rarity"], "path": mapped_path, "element": mapped_element, "icon": char.get("icon", ""), "preview": char.get("preview", ""), "portrait": char.get("portrait", ""), "staticData": json.dumps(static_data)}
                    }
                )
            print(f"✅ Characters: {len(char_data)} seeded.")

        # Seed Relics
        if core_res[1].status_code == 200:
            relic_data = core_res[1].json()
            for key, relic in relic_data.items():
                set_id = str(relic.get("set_id", ""))
                static_data = {
                    "setEffect": relic_sets_map.get(set_id),
                    "mainAffixes": relic_main_affixes_map.get(str(relic.get("main_affix_id", ""))),
                    "subAffixes": relic_sub_affixes_map.get(str(relic.get("sub_affix_id", "")))
                }
                await prisma.relic.upsert(
                    where={"id": str(relic["id"])},
                    data={
                        "create": {"id": str(relic["id"]), "name": relic["name"], "setId": set_id, "setName": relic.get("set_name", ""), "rarity": relic["rarity"], "icon": relic.get("icon", ""), "staticData": json.dumps(static_data)},
                        "update": {"name": relic["name"], "setId": set_id, "setName": relic.get("set_name", ""), "rarity": relic["rarity"], "icon": relic.get("icon", ""), "staticData": json.dumps(static_data)}
                    }
                )
            print(f"✅ Relics: {len(relic_data)} seeded.")

        # Seed Light Cones
        if core_res[2].status_code == 200:
            lc_data = core_res[2].json()
            for key, lc in lc_data.items():
                mapped_path = paths_map.get(lc.get("path", ""), {}).get("name", lc.get("path", ""))
                
                static_data = {
                    "skill": lc_ranks_map.get(str(lc.get("id", ""))),
                    "promotions": lc_promotions_map.get(str(lc.get("id", "")))
                }
                
                await prisma.lightcone.upsert(
                    where={"id": str(lc["id"])},
                    data={
                        "create": {"id": str(lc["id"]), "name": lc["name"], "rarity": lc["rarity"], "path": mapped_path, "desc": lc.get("desc", ""), "icon": lc.get("icon", ""), "preview": lc.get("preview", ""), "portrait": lc.get("portrait", ""), "staticData": json.dumps(static_data)},
                        "update": {"name": lc["name"], "rarity": lc["rarity"], "path": mapped_path, "desc": lc.get("desc", ""), "icon": lc.get("icon", ""), "preview": lc.get("preview", ""), "portrait": lc.get("portrait", ""), "staticData": json.dumps(static_data)}
                    }
                )
            print(f"✅ Light Cones: {len(lc_data)} seeded.")

        # Seed Items
        if core_res[3].status_code == 200:
            item_data = core_res[3].json()
            for key, item in item_data.items():
                await prisma.item.upsert(
                    where={"id": str(item["id"])},
                    data={
                        "create": {"id": str(item["id"]), "name": item["name"], "type": item.get("type", ""), "subType": item.get("sub_type", ""), "rarity": item.get("rarity", 1), "icon": item.get("icon", "")},
                        "update": {"name": item["name"], "type": item.get("type", ""), "subType": item.get("sub_type", ""), "rarity": item.get("rarity", 1), "icon": item.get("icon", "")}
                    }
                )
            print(f"✅ Items: {len(item_data)} seeded.")

        # Seed Achievements
        if core_res[4].status_code == 200:
            achieve_data = core_res[4].json()
            for key, ach in achieve_data.items():
                await prisma.achievement.upsert(
                    where={"id": str(ach["id"])},
                    data={
                        "create": {"id": str(ach["id"]), "seriesId": str(ach.get("series_id", "")), "title": ach["title"], "desc": ach.get("desc", ""), "hidden": ach.get("hidden", False)},
                        "update": {"seriesId": str(ach.get("series_id", "")), "title": ach["title"], "desc": ach.get("desc", ""), "hidden": ach.get("hidden", False)}
                    }
                )
            print(f"✅ Achievements: {len(achieve_data)} seeded.")

        # Seed Avatars
        if core_res[5].status_code == 200:
            avatar_data = core_res[5].json()
            for key, av in avatar_data.items():
                await prisma.avatar.upsert(
                    where={"id": str(av["id"])},
                    data={
                        "create": {"id": str(av["id"]), "name": av["name"], "icon": av.get("icon", "")},
                        "update": {"name": av["name"], "icon": av.get("icon", "")}
                    }
                )
            print(f"✅ Avatars: {len(avatar_data)} seeded.")

    # Seed Simulated Universe Archive Data
    print("Seeding Simulated Universe Archive...")
    for key, blessing in su_blessings.items():
        await prisma.archivedata.upsert(
            where={"id": f"bless_{blessing['id']}"},
            data={
                "create": {"id": f"bless_{blessing['id']}", "category": "SimulatedBlessing", "name": blessing.get("name", ""), "icon": blessing.get("icon", ""), "desc": blessing.get("desc", ""), "staticData": json.dumps(blessing)},
                "update": {"name": blessing.get("name", ""), "icon": blessing.get("icon", ""), "desc": blessing.get("desc", ""), "staticData": json.dumps(blessing)}
            }
        )
    for key, curio in su_curios.items():
        await prisma.archivedata.upsert(
            where={"id": f"curio_{curio['id']}"},
            data={
                "create": {"id": f"curio_{curio['id']}", "category": "SimulatedCurio", "name": curio.get("name", ""), "icon": curio.get("icon", ""), "desc": curio.get("desc", ""), "staticData": json.dumps(curio)},
                "update": {"name": curio.get("name", ""), "icon": curio.get("icon", ""), "desc": curio.get("desc", ""), "staticData": json.dumps(curio)}
            }
        )
    for key, event in su_events.items():
        await prisma.archivedata.upsert(
            where={"id": f"event_{event['id']}"},
            data={
                "create": {"id": f"event_{event['id']}", "category": "SimulatedEvent", "name": event.get("title", ""), "icon": event.get("image", ""), "desc": event.get("desc", ""), "staticData": json.dumps(event)},
                "update": {"name": event.get("title", ""), "icon": event.get("image", ""), "desc": event.get("desc", ""), "staticData": json.dumps(event)}
            }
        )
    print("✅ Simulated Universe Archive seeded.")

    await prisma.disconnect()
    print("Seeding Complete!")

def main():
    asyncio.run(fetch_and_seed())

if __name__ == "__main__":
    main()
