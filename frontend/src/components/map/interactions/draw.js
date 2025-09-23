import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import { Circle } from 'ol/geom';
import { Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';

function drawDot(map, lon, lat, color = 'red') {
  const dotSource = new VectorSource();
  const dot = new Circle(fromLonLat([lon, lat]), 5);
  const feature = new Feature(dot);
  dotSource.addFeature(feature);
  const dotLayer = new VectorLayer({
    source: dotSource,
    style: new Style({
      fill: new Fill({ color }),
      stroke: new Stroke({ color, width: 1 }),
    }),
  });
  map.addLayer(dotLayer);
}


function drawCircle(map, lon, lat, radius) {
  const circleSource = new VectorSource();
  const circle = new Circle(fromLonLat([lon, lat]), radius);
  const feature = new Feature(circle);
  circleSource.addFeature(feature);
  const circleLayer = new VectorLayer({
    source: circleSource,
    style: new Style({
      fill: new Fill({ color: 'rgba(255, 0, 0, 0.3)' }),
      stroke: new Stroke({ color: 'red', width: 2 }),
    }),
  });
  map.addLayer(circleLayer);
}


export { drawDot, drawCircle };