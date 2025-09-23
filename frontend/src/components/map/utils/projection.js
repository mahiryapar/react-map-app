import { toLonLat } from 'ol/proj';

function transformRing3857To4326(ring3857) {
  if (!ring3857 || !Array.isArray(ring3857)) return [];
  return ring3857.map(([x, y]) => {
    const [lon, lat] = toLonLat([x, y]);
    return [Number(lon.toFixed(6)), Number(lat.toFixed(6))];
  });
}

export { transformRing3857To4326 };