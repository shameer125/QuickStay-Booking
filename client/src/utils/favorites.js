export const FAVORITES_KEY = "quickstay_favorites";

export function readFavoriteIds() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function writeFavoriteIds(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function toggleFavoriteId(roomId) {
  const id = String(roomId);
  const list = readFavoriteIds();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  writeFavoriteIds(next);
  return !list.includes(id);
}

export function isFavorite(roomId) {
  return readFavoriteIds().includes(String(roomId));
}
