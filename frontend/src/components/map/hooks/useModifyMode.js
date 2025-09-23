import { useEffect } from 'react';
import { Modify } from 'ol/interaction';
import GeoJSON from 'ol/format/GeoJSON';

function useModifyModeEffect({ mapRef, identifiedSourceRef, editMode, onFeatureModify, lastModifiedGeometryRef, modifyInteractionRef }) {
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const hasFeature = identifiedSourceRef.current.getFeatures().length > 0;
    if (editMode) {
      if (!modifyInteractionRef.current && hasFeature) {
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
                onFeatureModify({ id: changed.getId?.() || null, geometry: changedGeoJSON.geometry, properties: changed.getProperties?.() || {} });
              }
            } catch(e) { console.warn('onFeatureModify error:', e); }
        });
      }
    } else {
      if (modifyInteractionRef.current) {
        try { map.removeInteraction(modifyInteractionRef.current); } catch(_) {}
        modifyInteractionRef.current = null;
      }
    }
  }, [editMode]);
}


export { useModifyModeEffect as useModifyMode };