import React, { useEffect, useState } from 'react';
import MapView, { DEFAULT_LON, DEFAULT_LAT } from './components/map/MapView';
import RightSideBar from './components/RightSideBar/RightSideBar.js';
import { savePolygon/*, fetchPolygons */,updatePolygon, deletePolygon} from './services/api';
import LeftSideBar from './components/LeftSideBar/LeftSideBar.js';
import QueryTableScreen from './components/query-table-screen/QueryTableScreen.jsx'; 
import DataExport from './components/data-export/Data-Export.jsx';


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
  const [dataExportOpen, setDataExportOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [queryScreenOpen, setQueryScreenOpen] = useState(false);
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
        <div id="left-buttons">
          <button id="identify-button" onClick={() => {
          setIdentifyMode(!identifyMode);
        }}>
          {identifyMode ? 'Çizim Modu' : 'Kimlik Modu'}
        </button>
        <button id="query-screen-button" onClick={() => {
          setQueryScreenOpen(!queryScreenOpen);
        }}>
          Sorgu Paneli
        </button>
        <button id="heatmap-button" onClick={() => {
          mapApiRef.current?.toggleHeatmap();
        }}>
          Daire Sayısı Isı Haritası
        </button>
        <button id="data-export-button" onClick={() => {
          setDataExportOpen(!dataExportOpen);
        }}>
          Veri İndir
        </button>
        </div>
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
      <DataExport
        isOpen={dataExportOpen}
        onClose={() => setDataExportOpen(false)}
      />  
      <QueryTableScreen 
        onClose={() => setQueryScreenOpen(false)}
        isOpen={queryScreenOpen}
        onClickRow={(feature) => { setLeftSidebarOpen(true); setSelectedFeature(feature); setQueryScreenOpen(false); }}
      />
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
      <RightSideBar
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
