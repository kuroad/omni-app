interface RelicSubStat {
  type: string;
  field: string;
  name: string;
  value: number;
  display: string;
  percent: boolean;
}

// Extracted Relic interface if needed elsewhere

export interface CleanedProfile {
  uid: string;
  nickname: string;
  level: number;
  avatarId: string;
  signature: string;
  characters: any[]; // Extended type can be added later
}

/**
 * Fetches profile data from Mihomo API and cleans it to remove unnecessary fields.
 */
export async function fetchAndCleanProfile(uid: string): Promise<CleanedProfile> {
  const response = await fetch(`https://api.mihomo.me/sr_info_parsed/${uid}?lang=id`);
  
  if (!response.ok) {
    if (response.status === 404 || response.status === 400) {
      throw new Error('UID not found');
    }
    throw new Error('Upstream error from Mihomo API');
  }
  
  const raw = await response.json();
  
  // Clean the payload
  const cleaned: CleanedProfile = {
    uid: raw.player?.uid,
    nickname: raw.player?.nickname,
    level: raw.player?.level,
    avatarId: raw.player?.avatar?.id,
    signature: raw.player?.signature,
    characters: raw.characters?.map((c: any) => ({
      id: c.id,
      name: c.name,
      rarity: c.rarity,
      level: c.level,
      promotion: c.promotion,
      path: {
        id: c.path?.id,
        name: c.path?.name
      },
      element: {
        id: c.element?.id,
        name: c.element?.name
      },
      attributes: c.attributes,
      additions: c.additions,
      relics: c.relics?.map((r: any) => ({
        id: r.id,
        name: r.name,
        setId: r.set_id,
        setName: r.set_name,
        rarity: r.rarity,
        level: r.level,
        mainStat: {
          name: r.main_affix?.name,
          value: r.main_affix?.value,
          display: r.main_affix?.display,
          percent: r.main_affix?.percent,
        },
        subStats: r.sub_affix?.map((sub: any) => ({
          type: sub.type,
          field: sub.field,
          name: sub.name,
          value: sub.value,
          display: sub.display,
          percent: sub.percent,
        })) || []
      })),
      lightCone: c.light_cone ? {
        id: c.light_cone.id,
        name: c.light_cone.name,
        rarity: c.light_cone.rarity,
        level: c.light_cone.level,
        attributes: c.light_cone.attributes
      } : null
    })) || []
  };

  return cleaned;
}
