import { useEffect } from 'react';
import GeoJSON from 'ol/format/GeoJSON';

function useSelectedFeatureEffect(mapRef,selectedFeature, identifiedSourceRef) {
  useEffect(() => {
    const src = identifiedSourceRef.current;
    if (!src) return;

    if (!selectedFeature) {
      src.clear();
      return;
    }

    const geom = selectedFeature.geometry;
    if (!geom || !geom.type || !geom.coordinates) {
      return;
    }
    src.clear();
    
    try {
      const fmt = new GeoJSON();
      const feature = fmt.readFeature(
        {
          type: 'Feature',
          geometry: geom, 
          properties: selectedFeature.properties || {}
        },
        {
          dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }
      );
      try {
        if (selectedFeature.id && feature.setId) feature.setId(selectedFeature.id);
      } catch (_) {}
      src.addFeature(feature);
      var view = mapRef.current.getView();
      var extent = feature.getGeometry().getExtent();
      view.fit(extent, { padding: [20, 20, 20, 20], maxZoom: 17, duration: 300 });
    } catch (e) {
      console.warn('Selected feature parse error:', e);
    }
  }, [selectedFeature, identifiedSourceRef]);
}

export { useSelectedFeatureEffect as useSelectFeature };