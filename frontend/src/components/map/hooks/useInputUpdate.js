import { useEffect } from 'react';
import { toLonLat } from 'ol/proj';

function useInputUpdateEffect(mapRef, setLon, setLat) {
  useEffect(() => {
    if (!mapRef.current) return;

    const handleMoveEnd = () => {
      const view = mapRef.current.getView();
      const center = view.getCenter();
      if (!center) return;
      const [long, lati] = toLonLat(center);
      setLon(parseFloat(long.toFixed(6)));
      setLat(parseFloat(lati.toFixed(6)));
    };

    mapRef.current.on('moveend', handleMoveEnd);
    handleMoveEnd();

    return () => {
      if (mapRef.current) {
        mapRef.current.un('moveend', handleMoveEnd);
      }
    };
  }, [setLon, setLat]);
}


export { useInputUpdateEffect as useInputUpdate };