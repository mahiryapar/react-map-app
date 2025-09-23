import { useEffect } from 'react';
import GeoJSON from 'ol/format/GeoJSON';

function usePersistedEffect({ persistedSourceRef, persistedFeatures, mapRef, buildFeatureCollection }) {
  useEffect(() => {
    if (!mapRef.current) return;
    const fmt = new GeoJSON();
    const featureCollection = buildFeatureCollection(persistedFeatures);
    const features = fmt.readFeatures(featureCollection, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    try { persistedSourceRef.current?.clear(); } catch (_) {}
    if (features?.length) {
      persistedSourceRef.current.addFeatures(features);
    }
  }, [persistedFeatures]);
}

export { usePersistedEffect as usePersisted };