/**
 * Stable placeholder when remote hotel photos fail (hotlink / 404).
 * Picsum returns a deterministic image per room id + slot index.
 */
export function picsumRoomUrl(roomId, slotIndex = 0) {
  const seed = String(roomId || "guest").replace(/[^a-zA-Z0-9]/g, "").slice(0, 20) || "stay";
  return `https://picsum.photos/seed/qs${seed}${slotIndex}/960/640`;
}

/** First usable URL from room.images, or placeholder. */
export function primaryRoomImageUrl(room, fallbacks) {
  const list = Array.isArray(room?.images)
    ? room.images.filter((u) => typeof u === "string" && u.trim())
    : [];
  if (list.length) return list[0].trim();
  if (Array.isArray(fallbacks) && fallbacks.length) {
    const i = Math.abs(String(room?._id || "").length) % fallbacks.length;
    return fallbacks[i];
  }
  return picsumRoomUrl(room?._id, 0);
}

export const CLASSIC_HOTEL_PHOTOS = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop",
];
