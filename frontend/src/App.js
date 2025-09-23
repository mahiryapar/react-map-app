import React, { useEffect, useState } from 'react';
import MapView, { DEFAULT_LON, DEFAULT_LAT } from './components/map/MapView';
import SidebarForm from './components/SidebarForm';
import { savePolygon/*, fetchPolygons */,updatePolygon, deletePolygon} from './services/api';
import LeftSideBar from './components/LeftSideBar.js';


function App() {
  const [lon, setLon] = useState(DEFAULT_LON);
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [geometry, setGeometry] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [persistedFeatures, setPersistedFeatures] = useState([]);
  const [modifiedFeature, setModifiedFeature] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [identifyMode, setIdentifyMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const mapApiRef = React.useRef(null);


 
  const loadPersisted = async () => {
    setLoadError(null);
    try {
    } catch (err) {
      setLoadError(err?.message || 'Kayıtlı veriler alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersisted();
  }, []);

  const handleLonChange = (e) => {
    if (e.target.value === '') return;
    const v = parseFloat(e.target.value);
    if (!Number.isNaN(v)) setLon(v);
  };
  const handleLatChange = (e) => {
    if (e.target.value === '') return;
    const v = parseFloat(e.target.value);
    if (!Number.isNaN(v)) setLat(v);
  };

  const handleSubmit = async (payload) => {
    await savePolygon(payload);
  };

  const handlePolygonComplete = (geom) => {
    setGeometry(geom);
    setSidebarOpen(true);
  };

  const handleCancel = () => {
    setGeometry(null);
    setSidebarOpen(false);
  };

  const handleSubmitSuccess = () => {
    setSidebarOpen(false);
    setGeometry(null);
    try { mapApiRef.current?.refreshWMS?.(); } catch (_) {}
    try { mapApiRef.current?.enableDrawing?.(); } catch (_) {}
  };

  return (
    <div>
      <div id="inputs-group">
        <button id="identify-button" onClick={() => {
          setIdentifyMode(!identifyMode);
        }}>
          {identifyMode ? 'Çizim Modu' : 'Kimlik Modu'}
        </button>
        <div id="input-group" style={{ marginBottom: '8px' }}>
          <label htmlFor='lon-input' style={{ fontWeight: 600 }}>Longitude</label><br />
          <input
            id='lon-input'
            type='number'
            step='0.000001'
            value={lon}
            onChange={handleLonChange}
            style={{ width: '160px' }}
          />
        </div>
        <div id="input-group" style={{ marginBottom: '8px' }}>
          <label htmlFor='lat-input' style={{ fontWeight: 600 }}>Latitude</label><br />
          <input
            id='lat-input'
            type='number'
            step='0.000001'
            value={lat}
            onChange={handleLatChange}
            style={{ width: '160px' }}
          />
        </div>
      </div>
      <LeftSideBar isOpen={leftSidebarOpen}
        geometry={geometry}
        feature={selectedFeature}
        modifiedFeature={modifiedFeature}
        onClose={() => { setLeftSidebarOpen(false); setSelectedFeature(null); setModifiedFeature(null); }}
        onSubmit={updatePolygon}
        onDelete={deletePolygon}
        onAfterSubmit={() => { setLeftSidebarOpen(false);
          setModifiedFeature(null);
          setSelectedFeature(null);
          mapApiRef.current?.refreshWMS?.();
         }}
         editMode={editMode}
         setEditMode={setEditMode}
      />
      <SidebarForm
        geometry={geometry}
        isOpen={sidebarOpen}
        onSubmit={handleSubmit}
        onSuccess={handleSubmitSuccess}
        onCancel={handleCancel}
      />
      {loading ? (
        <div style={{ padding: 16 }}>Kayıtlı veriler yükleniyor...</div>
      ) : (
        <>
          {loadError && (
            <div style={{ padding: 12, color: 'red' }}>Hata: {loadError}</div>
          )}
          <MapView
            lon={lon}
            lat={lat}
            setLon={setLon}
            setLat={setLat}
            onPolygonComplete={handlePolygonComplete}
            geometry={geometry}
            persistedFeatures={persistedFeatures}
            onReady={(api) => { mapApiRef.current = api; }}
            identifyMode={identifyMode}
            onFeatureIdentify={(feature) => {setSelectedFeature(feature)
              setLeftSidebarOpen(true);
            }}
            onFeatureModify={(f) => {
              setModifiedFeature(f);
            }}
            editMode={editMode}
            selectedFeature={selectedFeature}
          />
        </>
      )}
    </div>
  );
}

export default App;
