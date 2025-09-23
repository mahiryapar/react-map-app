import { Draw } from 'ol/interaction';
import GeoJSON from 'ol/format/GeoJSON';
import { transformRing3857To4326 } from './projection';

function togglePolygon(map, polygonInteractionRef, polygonActiveRef, onPolygonComplete, clickModeRef, drawSourceRef) {
  if (!polygonActiveRef.current) {
    const interaction = new Draw({
      source: drawSourceRef.current, // VectorSource olmalı
      type: 'Polygon',
    });
    map.addInteraction(interaction);
    polygonInteractionRef.current = interaction;
    polygonActiveRef.current = true;
    console.log('Polygon modu AÇIK');
    // Çizim bittiğinde polygon verisini al
    interaction.on('drawend', (evt) => PolygonEnded(evt, onPolygonComplete, clickModeRef, map, polygonInteractionRef, polygonActiveRef));
  } else {
    if (polygonInteractionRef.current) {
      map.removeInteraction(polygonInteractionRef.current);
    }
    polygonInteractionRef.current = null;
    polygonActiveRef.current = false;
    console.log('Polygon modu KAPALI');
  }
};


function PolygonEnded(evt, onPolygonComplete, clickModeRef, map, polygonInteractionRef, polygonActiveRef) {
  const geometry = getPolygonGeoJSON(evt);
  if (onPolygonComplete) {
    // Kapat: tıklama modları ve aktif poligon çizimi
    clickModeRef.current = null;
    if (polygonInteractionRef?.current) {
      try { map.removeInteraction(polygonInteractionRef.current); } catch (_) {}
      polygonInteractionRef.current = null;
    }
    if (polygonActiveRef) polygonActiveRef.current = false;
    try { onPolygonComplete(geometry); } catch (_) {}
  }
}


function getPolygonGeoJSON(evt) {
  const feature = evt.feature;
  const geometry = feature.getGeometry();

  const geojsonFmt = new GeoJSON();
  const featureGeoJson = geojsonFmt.writeFeatureObject(feature, {
    dataProjection: 'EPSG:4326',      // çıktı (lon,lat)
    featureProjection: 'EPSG:3857',   // harita projeksiyonu
  });

  console.log('Polygon GeoJSON (EPSG:4326):', featureGeoJson);
  const coords3857 = geometry.getCoordinates();
  const outerRing3857 = coords3857[0] || [];
  const outerRing4326 = transformRing3857To4326(outerRing3857);

  console.log('Polygon dış halka koordinatları [lon, lat]:', outerRing4326);
  return featureGeoJson.geometry;
}


export { togglePolygon, getPolygonGeoJSON, PolygonEnded };