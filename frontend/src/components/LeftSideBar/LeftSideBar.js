import React, { useEffect, useMemo, useState } from 'react';
import './style/LeftSideBar.css';

function controlInputs(mode = false) {
    const inputs = document.querySelectorAll('#polygon-form input, #polygon-form select, #polygon-form textarea');
    inputs.forEach(input => input.disabled = mode);
}

async function onayla(onAfterSubmit,onSubmit, feature, geometry, tur, kimlikId, ad, numarataj, aciklama) {
    console.log("onayla called with:", { feature, geometry, tur, kimlikId, ad, numarataj, aciklama});
    if(typeof onSubmit === 'function' && feature){
        await onSubmit({
            id: feature.id,
            geometry: geometry,
            properties: {
                tur,
                ad,
                numarataj,
                aciklama
            }
        });
    }
    onAfterSubmit();
}

async function sil(id,onDelete,onAfterSubmit) {
    if (typeof onDelete === 'function') {
        await onDelete(id);
    }
    onAfterSubmit();
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
    const [numarataj, setNumarataj] = useState('');
    const [aciklama, setAciklama] = useState('');
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
            if (feature && feature.properties) {
                const p = feature.properties;
                setTur(p.tur || '');
                setKimlikId(feature.id || '');
                setAd(p.Ad || p.ad || '');
                setNumarataj(p.numarataj || '');
                setAciklama(p.aciklama || '');
            } else {
                setTur('');
                setKimlikId(feature.id || '');
                setAd('');
                setNumarataj('');
                setAciklama('');
            }
        } else {
            setTur('');
            setKimlikId('');
            setAd('');
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

                    <label>
                        Numarataj
                        <input type="text" value={numarataj} onChange={(e) => setNumarataj(e.target.value)} placeholder="Örn: 25/A" disabled={true} />
                    </label>

                    <label>
                        Açıklama
                        <textarea value={aciklama} onChange={(e) => setAciklama(e.target.value)} rows={3} placeholder="Not ekleyin" disabled={true} />
                    </label>
                    <button
                        id="confirm-button"
                        type="button"
                        onClick={() => onayla(onAfterSubmit,onSubmit, feature, geometry, tur, kimlikId, ad, numarataj, aciklama)}
                    >Bilgileri Düzenle</button>
                    <button
                        id="delete-button"
                        type="button"
                        onClick={() => sil(feature.id,onDelete,onAfterSubmit)}
                    >Yapıyı Sil</button>
                </form>
            </div>
        </aside>
    )
}