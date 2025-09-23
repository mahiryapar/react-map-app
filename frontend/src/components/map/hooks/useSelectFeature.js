import { useEffect } from 'react';

function useSelectedFeatureEffect(selectedFeature, identifiedSourceRef) {
  useEffect(() => {
    if (!selectedFeature) {
      identifiedSourceRef.current.clear();
    }
  }, [selectedFeature]);
}

export { useSelectedFeatureEffect as useSelectFeature };