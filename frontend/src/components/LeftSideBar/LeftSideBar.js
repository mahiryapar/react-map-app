import React, { useEffect, useMemo, useState, useRef } from 'react';
import './style/LeftSideBar.css';
import { getImageCount } from '../../services/api';
import { get } from 'ol/proj';

function controlInputs(mode = false) {
    const inputs = document.querySelectorAll('#polygon-form input, #polygon-form select, #polygon-form textarea');
    inputs.forEach(input => input.disabled = mode);
}

async function onayla(onAfterSubmit, onSubmit, feature, geometry, tur, kimlikId, ad, numarataj, daire_sayisi, aciklama) {
    console.log("onayla called with:", { feature, geometry, tur, kimlikId, ad, numarataj, daire_sayisi, aciklama });
    if (typeof onSubmit === 'function' && feature) {
        await onSubmit({
            id: feature.id,
            geometry: geometry,
            properties: {
                tur,
                ad,
                daire_sayisi,
                numarataj,
                aciklama
            }
        });
    }
    onAfterSubmit();
}

async function sil(id, onDelete, onAfterSubmit) {
    if (typeof onDelete === 'function') {
        await onDelete(id);
    }
    onAfterSubmit();
}

async function getImageCountt(polygonId) {
    try {
        const count = await getImageCount(polygonId);
        return count;
    } catch (error) {
        console.error("Error fetching image count:", error);
        return 0;
    }
}

export default function LeftSideBar({
    onDelete,
    editMode,
    setEditMode,
    onAfterSubmit,
    isOpen,
    feature,
    modifiedFeature,
    geometry: externalGeometry,
    onClose,
    onSubmit
}) {
    const [tur, setTur] = useState('');
    const [kimlikId, setKimlikId] = useState('');
    const [ad, setAd] = useState('');
    const [daire_sayisi, setDaireSayisi] = useState(0);
    const [numarataj, setNumarataj] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [availableFileCount, setAvailableFileCount] = useState(0);
    const [aciklama, setAciklama] = useState('');
    const fileInputRef = useRef(null);
    const geometry = useMemo(() => {
        return (
            modifiedFeature?.geometry ||
            feature?.geometry ||
            externalGeometry ||
            null
        );
    }, [modifiedFeature, feature, externalGeometry]);

    useEffect(() => {
        if (feature) {
            if ('ad' in feature) {
                getImageCount(feature.id).then(count => {
                    setAvailableFileCount(count || 0);
                }).catch(err => {
                    console.error("Error fetching image count:", err);
                    setAvailableFileCount(0);
                });
                setAd(feature.ad || '');
                setTur(feature.tur || '');
                setKimlikId(feature.id || '');
                setDaireSayisi(feature.daire_sayisi || 0);
                setNumarataj(feature.numarataj || '');
                setAciklama(feature.aciklama || '');
                return;
            }
            if (feature && feature.properties) {
                getImageCount(feature.id).then(count => {
                    setAvailableFileCount(count || 0);
                }).catch(err => {
                    console.error("Error fetching image count:", err);
                    setAvailableFileCount(0);
                });
                const p = feature.properties;
                setTur(p.tur || '');
                setKimlikId(feature.id || '');
                setDaireSayisi(p.daire_sayisi || 0);
                setAd(p.Ad || p.ad || '');
                setNumarataj(p.numarataj || '');
                setAciklama(p.aciklama || '');
            } else {
                setTur('');
                setKimlikId(feature.id || '');
                setDaireSayisi(0);
                setSelectedFiles([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setAd('');
                setNumarataj('');
                setAciklama('');
            }
        } else {
            setTur('');
            setKimlikId('');
            setDaireSayisi(0);
            setAd('');
            setSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setNumarataj('');
            setAciklama('');
        }
        setEditMode(false);
    }, [feature]);



    useEffect(() => {
        if (!isOpen) {
            setEditMode(false);
            const el = document.getElementById("polygon-form-left-sidebar");
            if (el) el.style.left = "-500px";
        }
        else {
            const el = document.getElementById("polygon-form-left-sidebar");
            if (el) el.style.left = "1.5rem";
            setEditMode(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!editMode) {
            controlInputs(true);
            const btn = document.getElementById('confirm-button');
            const deleteBtn = document.getElementById('delete-button');
            if (btn) btn.style.display = 'none';
            if (deleteBtn) deleteBtn.style.display = 'none';
        }
        else {
            controlInputs(false);
            const btn = document.getElementById('confirm-button');
            const deleteBtn = document.getElementById('delete-button');
            if (btn) btn.style.display = 'block';
            if (deleteBtn) deleteBtn.style.display = 'block';
        }
    }, [editMode]);


    return (
        <aside id="polygon-form-left-sidebar" className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <form id="polygon-form" onSubmit={null}>
                    <div id="form-header">
                        <h3>Poligon Bilgileri</h3>
                        <button id="edit-button" type="button" onClick={() => setEditMode(!editMode)}>Düzenle</button>
                        <button id="close-button" type="button" onClick={onClose}>X</button>
                    </div>
                    <label htmlFor="type-select">Tür:
                        <select value={tur} onChange={(e) => setTur(e.target.value)} disabled={true}>
                            <option value="">Seçiniz</option>
                            <option value="arsa">Arsa</option>
                            <option value="bina">Bina</option>
                            <option value="yol">Yol</option>
                            <option value="park">Park</option>
                            <option value="yesil_alan">Yeşil Alan</option>
                            <option value="diger">Diğer</option>
                        </select>
                    </label>
                    <label>
                        Kimlik / ID
                        <input type="text" value={kimlikId} onChange={(e) => setKimlikId(e.target.value)} placeholder="Örn: 12345" disabled={true} />
                    </label>

                    <label>
                        Ad
                        <input type="text" value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Alan adı" disabled={true} />
                    </label>
                    {tur === 'bina' && (
                        <label>
                            Daire Sayısı
                            <input type="number" value={daire_sayisi} min="0" max="150" onChange={(e) => setDaireSayisi(e.target.value)} placeholder="Daire sayısı" disabled={true} />
                        </label>
                    )}

                    <label>
                        Numarataj
                        <input type="text" value={numarataj} onChange={(e) => setNumarataj(e.target.value)} placeholder="Örn: 25/A" disabled={true} />
                    </label>

                    <label>
                        Açıklama
                        <textarea value={aciklama} onChange={(e) => setAciklama(e.target.value)} rows={3} placeholder="Not ekleyin" disabled={true} />
                    </label>

                    <label>
                        Resimler (Opsiyonel)
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={true}
                            ref={fileInputRef}
                            onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                        />
                    </label>

                    <label>
                        Mevcut Resimler: {availableFileCount === 0 ? 'Resim Bulunamadı.' : availableFileCount + " adet resim bulundu."} 
                        <button id="img-view-screen-button" disabled={availableFileCount === 0} type="button" onClick={null}>Resimleri Görüntüle</button>
                    </label>
                    <button
                        id="confirm-button"
                        type="button"
                        onClick={() => onayla(onAfterSubmit, onSubmit, feature, geometry, tur, kimlikId, ad, numarataj, daire_sayisi, aciklama)}
                    >Bilgileri Düzenle</button>
                    <button
                        id="delete-button"
                        type="button"
                        onClick={() => sil(feature.id, onDelete, onAfterSubmit)}
                    >Yapıyı Sil</button>
                </form>
            </div>
        </aside>
    )
}