import { useEffect } from 'react';

function useIdentifyEffect(identifyMode, identifyModeRef) {
    useEffect(() => {
        identifyModeRef.current = identifyMode;
    }, [identifyMode]);
}

export { useIdentifyEffect as useIdentify };