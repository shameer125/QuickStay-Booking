import React, { useEffect, useState } from "react";
import {
  picsumRoomUrl,
  primaryRoomImageUrl,
  CLASSIC_HOTEL_PHOTOS,
} from "../utils/roomImages";

export default function RoomImg({
  room,
  slot = 0,
  alt = "",
  className = "",
  ...imgProps
}) {
  const list = Array.isArray(room?.images)
    ? room.images
        .map((u) => (typeof u === "string" ? u.trim() : ""))
        .filter(Boolean)
    : [];
  const preferred = list[slot] || list[0];
  const initial = preferred || primaryRoomImageUrl(room, CLASSIC_HOTEL_PHOTOS);
  const [src, setSrc] = useState(initial);

  useEffect(() => {
    const arr = Array.isArray(room?.images)
      ? room.images
          .map((u) => (typeof u === "string" ? u.trim() : ""))
          .filter(Boolean)
      : [];
    const next =
      arr[slot] || arr[0] || primaryRoomImageUrl(room, CLASSIC_HOTEL_PHOTOS);
    setSrc(next);
  }, [room, slot]);

  return (
    <img
      {...imgProps}
      className={className}
      src={src}
      alt={alt}
      onError={() => {
        setSrc(picsumRoomUrl(room?._id || "img", slot));
      }}
    />
  );
}
