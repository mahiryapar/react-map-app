import { useEffect } from 'react';

function usePolygonClearEffect(mapRef, geometry, polygonInteractionRef, polygonActiveRef, clickModeRef, drawSourceRef) {
  useEffect(() => {
    if (!mapRef.current) return;
    if (geometry == null) {
      document.getElementById("polygon-form-sidebar").classList.remove('open');
      try { drawSourceRef.current?.clear(); } catch (_) {}
      if (polygonInteractionRef.current) {
        try { mapRef.current.removeInteraction(polygonInteractionRef.current); } catch (_) {}
        polygonInteractionRef.current = null;
      }
      polygonActiveRef.current = false;
      clickModeRef.current = null;
    }
  }, [geometry]);

}


export { usePolygonClearEffect as usePolygonClear };