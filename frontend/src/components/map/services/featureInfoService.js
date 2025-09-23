import { transformRing3857To4326 } from '../utils/projection';
import config from '../config.json';
const GEOSERVER_WORKSPACE = config?.GeoServer?.workspace;
const GEOSERVER_LAYER = config?.GeoServer?.layerName;

function runGetFeatureInfo(map,wmsLayerRef,coordinates,onFeatureIdentify, loadIdentifiedFeature) {
  const view = map.getView(); 
  const viewResolution = view.getResolution();
  const projection = view.getProjection();
  console.log("runGetFeatureInfo at:", projection);
  const wmsLayer = wmsLayerRef.current;
  const source = wmsLayer?.getSource();
  if (!source) return;
  const layername = `${GEOSERVER_WORKSPACE}:${GEOSERVER_LAYER}`;
  const url = source.getFeatureInfoUrl(
    coordinates,
    viewResolution,
    projection,
    { 'INFO_FORMAT': 'application/json', 'QUERY_LAYERS': layername, 'FEATURE_COUNT': 1 });
    if(!url) return;
    fetch(url)
    .then(r=> r.ok ? r.json() : null)
    .then(data =>{
      const features = data?.features;
      if(!features) return;
      var coordinates = features[0].geometry.coordinates;
      var coordinates4326 = [];
      transformRing3857To4326(coordinates[0]).forEach(c=>{
        coordinates4326.push(c);
      });
      features[0].geometry.coordinates = [coordinates4326];
      loadIdentifiedFeature(features[0]);
      onFeatureIdentify({id: features[0]?.id || null, properties: features[0]?.properties || null, geometry: features[0]?.geometry || null});
    })
    .catch(e=>{
      console.error('Error fetching feature info:', e);
    });
}


export { runGetFeatureInfo };