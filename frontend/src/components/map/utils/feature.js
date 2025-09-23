import { useCallback } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Modify } from 'ol/interaction';

// Custom hook returning memoized loader for identified feature
function useLoadIdentifiedFeature({ mapRef, identifiedSourceRef, modifyInteractionRef, editMode, lastModifiedGeometryRef, onFeatureModify }) {
  return useCallback((feat) => {
    if (!feat?.geometry) return;
    if (!mapRef.current) return;
    const map = mapRef.current;
    identifiedSourceRef.current.clear();
    try {
      const fmt = new GeoJSON();
      const feature = fmt.readFeature(
        {
          type: 'Feature',
            geometry: feat.geometry,          // 4326 bekleniyor
            properties: feat.properties || {}
        },
        {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        }
      );
      identifiedSourceRef.current.addFeature(feature);
    } catch(e) {
      console.warn('Identify feature parse error:', e);
      return;
    }
    if (modifyInteractionRef.current) {
      try { map.removeInteraction(modifyInteractionRef.current); } catch(_) {}
      modifyInteractionRef.current = null;
    }
    if (editMode) {
      const mapModify = new Modify({ source: identifiedSourceRef.current });
      modifyInteractionRef.current = mapModify;
      map.addInteraction(mapModify);
      mapModify.on('modifyend', (ev) => {
        const changed = ev.features.item(0);
        if (!changed) return;
        const fmt = new GeoJSON();
        const changedGeoJSON = fmt.writeFeatureObject(changed, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        console.log('Modified geometry (EPSG:4326):', changedGeoJSON.geometry);
        lastModifiedGeometryRef.current = changedGeoJSON.geometry;
        try {
          if (typeof onFeatureModify === 'function') {
            onFeatureModify({ id: feat?.id || null, geometry: changedGeoJSON.geometry, properties: feat?.properties || {} });
          }
        } catch(e) { console.warn('onFeatureModify error:', e); }
      });
    }
  }, [editMode, mapRef, identifiedSourceRef, modifyInteractionRef, lastModifiedGeometryRef, onFeatureModify]);
}

const buildFeatureCollection = (input) => {
    const toFeature = (item) => {
      if (!item) return null;
      if (item.type === 'Feature' && item.geometry && item.geometry.type && item.geometry.coordinates) return item;
      if (item.geometry && item.geometry.type && item.geometry.coordinates) {
        return { type: 'Feature', geometry: item.geometry, properties: item.properties || {} };
      }
      if (item.type && item.coordinates) {
        return { type: 'Feature', geometry: item, properties: {} };
      }
      return null;
    };

    let features = [];
    if (Array.isArray(input)) {
      features = input.map(toFeature).filter(Boolean);
    } else if (input && input.type === 'FeatureCollection' && Array.isArray(input.features)) {
      features = input.features.map(toFeature).filter(Boolean);
    } else if (input && input.type === 'Feature') {
      const f = toFeature(input);
      features = f ? [f] : [];
    } else if (input && input.type && input.coordinates) {
      const f = toFeature(input);
      features = f ? [f] : [];
    }
    return { type: 'FeatureCollection', features };
  };

export { useLoadIdentifiedFeature, buildFeatureCollection };

