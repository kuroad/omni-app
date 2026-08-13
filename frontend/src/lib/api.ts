// Type definition based on our CleanedProfile from backend
export interface RelicSubStat {
  type: string;
  field: string;
  name: string;
  value: number;
  display: string;
  percent: boolean;
}

export interface Relic {
  id: string;
  name: string;
  setId: string;
  setName: string;
  rarity: number;
  level: number;
  mainStat: { name: string; value: number; display: string; percent: boolean };
  subStats: RelicSubStat[];
}

export interface Character {
  id: string;
  name: string;
  rarity: number;
  level: number;
  promotion: number;
  path: { id: string; name: string };
  element: { id: string; name: string };
  attributes: any[];
  additions: any[];
  relics: Relic[];
  lightCone: any;
}

export interface ProfileData {
  uid: string;
  nickname: string;
  level: number;
  avatarId: string;
  signature: string;
  characters: Character[];
}

export async function getProfile(uid: string): Promise<ProfileData> {
  const res = await fetch(`/api/user/${uid}`);
  if (!res.ok) {
    throw new Error('Gagal mengambil data profil atau UID tidak ditemukan.');
  }
  return res.json();
}

export async function getCharacters() {
  const res = await fetch(`/api/characters`);
  if (!res.ok) {
    throw new Error('Gagal mengambil data karakter');
  }
  const result = await res.json();
  return result.data;
}
