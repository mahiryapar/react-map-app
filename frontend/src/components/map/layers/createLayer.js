import VectorLayer from 'ol/layer/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import OLMap from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import config from '../config.json';
const GEOSERVER_URL = config?.GeoServer?.url;
const GEOSERVER_WORKSPACE = config?.GeoServer?.workspace;
const GEOSERVER_LAYER = config?.GeoServer?.layerName;

function createDrawLayer(map, drawSourceRef) {
  const vectorLayer = new VectorLayer({
    source: drawSourceRef.current,
    style: new Style({
      fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
      stroke: new Stroke({ color: 'blue', width: 2 }),
    }),
  });
  map.addLayer(vectorLayer);
}

function createPersistedLayer(map, persistedSourceRef) {
  const vectorLayer = new VectorLayer({
    source: persistedSourceRef.current,
    style: new Style({
      fill: new Fill({ color: 'rgba(0, 128, 0, 0.15)' }),
      stroke: new Stroke({ color: 'green', width: 2 }),
    }),
  });
  map.addLayer(vectorLayer);
}

function createGeoServerWMSLayer() {
  const layerName = `${GEOSERVER_WORKSPACE}:${GEOSERVER_LAYER}`;
  return new TileLayer({
    source: new TileWMS({
      url: `${GEOSERVER_URL}/wms`,
      params: {
        LAYERS: layerName,
        TILED: true,
        FORMAT: 'image/png',
        TRANSPARENT: true,
        VERSION: '1.1.1',
      },
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
    }),
    visible: true,
  });
}


function createOLMap(divRef, lon, lat, zoom, wmsLayerRef) {
  const wmsLayer = createGeoServerWMSLayer();
  if (wmsLayerRef) {
    wmsLayerRef.current = wmsLayer;
  }
  return new OLMap({
    target: divRef.current,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      wmsLayer,
    ],
    view: new View({
      center: fromLonLat([lon, lat]),
      zoom,
    }),
  });
}


export { createDrawLayer, createPersistedLayer, createGeoServerWMSLayer, createOLMap };