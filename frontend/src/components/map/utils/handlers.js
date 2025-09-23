import { toLonLat } from 'ol/proj';
import { drawCircle, drawDot } from '../interactions/draw';
import { runGetFeatureInfo } from '../services/featureInfoService';
import { isSidebarOpen } from './sidebar';
import { togglePolygon } from './polygon';

function singleClickHandler(evt, identifyModeRef, clickModeRef, map,wmsLayerRef,onFeatureIdentify, loadIdentifiedFeature) {
  if (identifyModeRef.current) {
    runGetFeatureInfo(map, wmsLayerRef, evt.coordinate, onFeatureIdentify, loadIdentifiedFeature);
    return;
  }
  if (!clickModeRef.current) return;
  const coord = evt.coordinate;
  const [lonWgs, latWgs] = toLonLat(coord);
  if (clickModeRef.current === 'circle') {
    drawCircle(map, lonWgs, latWgs, 20);
  }
  else if (clickModeRef.current === 'dot') {
    drawDot(map, lonWgs, latWgs, 'red');
  } else if (clickModeRef.current === 'dotGreen') {
    drawDot(map, lonWgs, latWgs, 'green');
  }
  clickModeRef.current = null;
};

function setKeyHandler(map, identifyModeRef, polygonInteractionRef, polygonActiveRef, clickModeRef, onPolygonComplete, drawSourceRef) {
  const keyHandler = (e) => {
    if(identifyModeRef.current) return;
    const k = e.key.toLowerCase();
    const sidebarOpen = isSidebarOpen();
    if (k === 'p' && !sidebarOpen) {
      togglePolygon(map, polygonInteractionRef, polygonActiveRef, onPolygonComplete , clickModeRef, drawSourceRef);
    } else if (k === 'c') {
      if (!sidebarOpen) clickModeRef.current = 'circle';
    } else if (k === 'r') {
      if (!sidebarOpen) clickModeRef.current = 'dot';
    } else if (k === 'g') {
      if (!sidebarOpen) clickModeRef.current = 'dotGreen';
    } else if (k === 'escape') {
      clickModeRef.current = null;
    }
  };
  window.addEventListener('keydown', keyHandler);
  return keyHandler;
}


export { singleClickHandler, setKeyHandler };