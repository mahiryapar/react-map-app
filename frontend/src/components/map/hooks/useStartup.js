import { useEffect } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { createDrawLayer, createPersistedLayer, createOLMap } from '../layers/createLayer';
import { singleClickHandler, setKeyHandler } from '../utils/handlers';
import { togglePolygon } from '../utils/polygon';
const FIT_EXTENT_OPTIONS = { padding: [20,20,20,20], maxZoom: 18, duration: 300 };

function useStartUpEffect({ mapRef, lon, lat, zoom, divRef, wmsLayerRef, drawSourceRef, persistedSourceRef, identifiedSourceRef, identifiedLayerRef, polygonInteractionRef, polygonActiveRef, clickModeRef, identifyModeRef, onPolygonComplete, onFeatureIdentify, loadIdentifiedFeature, persistedFeatures, onReady }) {
  useEffect(() => {
    if (!divRef.current) return;
  mapRef.current = createOLMap(divRef, lon, lat, zoom, wmsLayerRef);
    const map = mapRef.current;
    if (!map) return;
    createDrawLayer(map, drawSourceRef);
    createPersistedLayer(map, persistedSourceRef);
    // Identified (editable) feature layer - blue style
    identifiedLayerRef.current = new VectorLayer({
      source: identifiedSourceRef.current,
      style: new Style({
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.15)' }),
        stroke: new Stroke({ color: '#0066ff', width: 3 })
      })
    });
    map.addLayer(identifiedLayerRef.current);
    try {
      const fmt = new GeoJSON();
      const featureCollection = persistedFeatures; // already feature collection shaped by caller
      if (!featureCollection.features.length) {
        // nothing to add
      }
      const features = fmt.readFeatures(featureCollection, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      if (features?.length) {
        persistedSourceRef.current.addFeatures(features);
        try {
          const extent = persistedSourceRef.current.getExtent();
          if (extent && extent.every((v) => Number.isFinite(v))) {
            map.getView().fit(extent, FIT_EXTENT_OPTIONS);
          }
        } catch (_) {}
      }
    } catch (e) {
      console.warn('Persisted features parse error:', e);
    }

    const onSingleClick = (evt) => singleClickHandler(evt, identifyModeRef , clickModeRef, map, wmsLayerRef, onFeatureIdentify, loadIdentifiedFeature);
    map.on('singleclick', onSingleClick);

    const keyHandler = setKeyHandler(map, identifyModeRef, polygonInteractionRef, polygonActiveRef, clickModeRef, onPolygonComplete, drawSourceRef);
    if (typeof onReady === 'function') {
      onReady({
        enableDrawing: () => {
          if (!mapRef.current) return;
          if (!polygonActiveRef.current) {
            togglePolygon(mapRef.current, polygonInteractionRef, polygonActiveRef, onPolygonComplete, clickModeRef, drawSourceRef);
          }
        },
        disableDrawing: () => {
          if (!mapRef.current) return;
          if (polygonActiveRef.current) {
            togglePolygon(mapRef.current, polygonInteractionRef, polygonActiveRef, onPolygonComplete, clickModeRef, drawSourceRef);
          }
        },
        refreshWMS: () => {
          try {
            const layer = wmsLayerRef.current;
            const src = layer?.getSource?.();
            if (src?.updateParams) {
              src.updateParams({ _cb: Date.now() });
            } else if (src?.refresh) {
              src.refresh();
            }
          } catch (_) {}
        },
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);   // cleanup
        mapRef.current = null;
      }
      window.removeEventListener('keydown', keyHandler);
      map.un('singleclick', onSingleClick);
      if (polygonInteractionRef.current) map.removeInteraction(polygonInteractionRef.current);
    };
  }, []);
}

export { useStartUpEffect as useStartup };