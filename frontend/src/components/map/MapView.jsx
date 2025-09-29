import 'ol/ol.css';
import React, { useRef } from 'react';
import VectorSource from 'ol/source/Vector';
import config from './config.json';
import { useStartup } from './hooks/useStartup';
import { useInputUpdate } from './hooks/useInputUpdate';
import { useRecenter } from './hooks/useRecenter';
import { usePolygonClear } from './hooks/usePolygonClear';
import { useIdentify } from './hooks/useIdentify';
import { useSelectFeature } from './hooks/useSelectFeature';
import { useModifyMode } from './hooks/useModifyMode';
import { usePersisted } from './hooks/usePersisted';
import { useLoadIdentifiedFeature, buildFeatureCollection } from './utils/feature';
import './style/MapView.css';

export const DEFAULT_LON = config?.defaultLon;
export const DEFAULT_LAT = config?.defaultLat;
export const DEFAULT_ZOOM = 17;



export default function MapView({
	selectedFeature,
	editMode,
	identifyMode,
	lon = DEFAULT_LON,
	lat = DEFAULT_LAT,
	zoom = DEFAULT_ZOOM,
	setLon = () => {},
	setLat = () => {},
	className,
	style,
	onPolygonComplete,
	geometry,
	persistedFeatures = [],
	onReady,
	onFeatureIdentify = () => {},
	onFeatureModify = () => {}
}) {
	// refs
	const mapRef = useRef(null);
	const divRef = useRef(null);
	const clickModeRef = useRef(null);
	const identifyModeRef = useRef(null);
	const drawSourceRef = useRef(new VectorSource());
	const persistedSourceRef = useRef(new VectorSource());
	const polygonInteractionRef = useRef(null);
	const polygonActiveRef = useRef(false);
	const wmsLayerRef = useRef(null);
	const heatmapLayerRef = useRef(null);
	const identifiedSourceRef = useRef(new VectorSource());
	const modifyInteractionRef = useRef(null);
	const identifiedLayerRef = useRef(null);
	const lastModifiedGeometryRef = useRef(null);

	// Load identified feature util callback (custom hook)
	const loadIdentifiedFeature = useLoadIdentifiedFeature({
		mapRef,
		identifiedSourceRef,
		modifyInteractionRef,
		editMode,
		lastModifiedGeometryRef,
		onFeatureModify
	});

	useIdentify(identifyMode, identifyModeRef);
	useSelectFeature(mapRef, selectedFeature, identifiedSourceRef);
	useModifyMode({ mapRef, identifiedSourceRef, editMode, onFeatureModify, lastModifiedGeometryRef, modifyInteractionRef });
	useStartup({
		mapRef,
		lon,
		lat,
		zoom,
		divRef,
		wmsLayerRef,
		heatmapLayerRef,
		drawSourceRef,
		persistedSourceRef,
		identifiedSourceRef,
		identifiedLayerRef,
		polygonInteractionRef,
		polygonActiveRef,
		clickModeRef,
		identifyModeRef,
		onPolygonComplete,
		onFeatureIdentify,
		loadIdentifiedFeature,
		persistedFeatures: buildFeatureCollection(persistedFeatures),
		onReady
	});
	usePolygonClear(mapRef, geometry, polygonInteractionRef, polygonActiveRef, clickModeRef, drawSourceRef);
	useInputUpdate(mapRef, setLon, setLat);
	useRecenter(mapRef, lon, lat);
	usePersisted({ persistedSourceRef, persistedFeatures, mapRef, buildFeatureCollection });

	return (
		<div
			id="map"
			ref={divRef}
			className={className}
			style={{ width: '100%', height: '100vh', ...style }}
		/>
	);
}
