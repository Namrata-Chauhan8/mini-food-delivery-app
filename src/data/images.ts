/**
 * Remote image URLs (Unsplash). Centralised so the mock data reads cleanly and a
 * broken link only has to be fixed in one place.
 */
const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const IMAGES = {
  pizza: unsplash('1565299624946-b28f40a0ae38'),
  burger: unsplash('1568901346375-23c9450c58cd'),
  biryani: unsplash('1585937421612-70a008356fbe'),
  tacos: unsplash('1631452180519-c014fe946bc7'),
  pancakes: unsplash('1567620905732-2d1ec7ab7445'),
  salad: unsplash('1546069901-ba9599a7e63c'),
  steak: unsplash('1504674900247-0877df9cc836'),
  bowl: unsplash('1512621776951-a57141f2eefd'),
  veg: unsplash('1540189549336-e6e99c3679fe'),
  restaurant: unsplash('1414235077428-338989a2e8c0'),
  cafe: unsplash('1517248135467-4c7edcad34c4'),
  interior: unsplash('1552566626-52f8b828add9'),
  coffee: unsplash('1466978913421-dad2ebd01d17'),
  noodles: unsplash('1563379926898-05f4575a45d8'),
  paneer: unsplash('1626804475297-41608ea09aeb'),
  dosa: unsplash('1589302168068-964664d93dc0'),
  falafel: unsplash('1606491956689-2ea866880c84'),
  samosa: unsplash('1601050690597-df0568f70950'),
  smoothie: unsplash('1559314809-0d155014e29e'),
  dessert: unsplash('1551024506-0bccd828d307'),
  cake: unsplash('1488477181946-6428a0291777'),
  icecream: unsplash('1565958011703-44f9829ba187'),
} as const;

export type ImageKey = keyof typeof IMAGES;

/** Tiny blurhash-ish placeholder shown by expo-image while the real image loads. */
export const IMAGE_PLACEHOLDER = { blurhash: 'L6PZfSjE.AyE_3t7t7R**0o#DgR4' };
