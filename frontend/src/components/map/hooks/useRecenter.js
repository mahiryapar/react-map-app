import { useEffect } from 'react';
import { fromLonLat } from 'ol/proj';

function useRecenterEffect(mapRef, lon, lat) {
  useEffect(() => {
    if (!mapRef.current) return;
    const view = mapRef.current.getView();
    view.setCenter(fromLonLat([lon, lat]));
  }, [lon, lat]);
}

export { useRecenterEffect as useRecenter };