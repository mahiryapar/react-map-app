import React, { useEffect, useMemo, useRef, useState } from 'react';
import './style/RightSideBar.css';


export default function SidebarForm({ geometry, isOpen, onSubmit, onSuccess, onCancel }) {
    const [tur, setTur] = useState('');
    const [ad, setAd] = useState('');
    const [numarataj, setNumarataj] = useState('');
    const [daire_sayisi, setDaireSayisi] = useState(0);
    const [aciklama, setAciklama] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);


    useEffect(() => {
        setMessage(null);
        setError(null);
    }, [geometry]);

    const isValid = useMemo(() => {
        return Boolean(geometry) && tur.trim() && ad.trim();
    }, [geometry, tur, ad]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        if (!isValid) return;
        setLoading(true);
        try {
            const payload = {
                geometry,
                properties: {
                    tur,
                    ad,
                    daire_sayisi: tur === 'bina'
                        ? (daire_sayisi?.toString().trim() || '0') // CHANGED: string gönder
                        : null,
                    numarataj: numarataj || null,
                    aciklama: aciklama || null,
                },
            };
            await onSubmit?.(payload, selectedFiles);
            setMessage('Başarıyla kaydedildi.');
            setTur('');
            setAd('');
            setDaireSayisi(0);
            setNumarataj('');
            setAciklama('');
            setSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } catch (err) {
            setError(err?.message || 'Kaydetme sırasında bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Sidebar visibility is controlled by parent via isOpen
    const open = Boolean(isOpen);
    return (
        <aside id="polygon-form-sidebar" className={open ? 'open' : ''}>
            <h3 style={{ marginTop: 0 }}>Çizilen Alan Bilgileri</h3>

            <div className="geom-status">
                {geometry ? (
                    <span className="ok">Alan seçildi ✓</span>
                ) : (
                    <span className="warn">Henüz alan çizilmedi</span>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <label>
                    Tür
                    <select value={tur} onChange={(e) => setTur(e.target.value)}>
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
                    Ad
                    <input type="text" value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Alan adı" required />
                </label>

                {tur === 'bina' && (
                    <>
                        <label>
                            Daire Sayısı
                            <input type="number" value={daire_sayisi} onChange={(e) => setDaireSayisi(e.target.value)} placeholder="Daire sayısı" min="0" max="150" />
                        </label>

                    </>
                )}

                <label>
                    Numarataj
                    <input type="text" value={numarataj} onChange={(e) => setNumarataj(e.target.value)} placeholder="Örn: 25/A" />
                </label>
                <label>
                    Açıklama
                    <textarea value={aciklama} onChange={(e) => setAciklama(e.target.value)} rows={3} placeholder="Not ekleyin" />
                </label>

                <label>
                    Resimler (Opsiyonel)
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        placeholder='Resim seçin'
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                    />
                </label>

                <div className="actions">
                    <button type="submit" disabled={!isValid || loading}>
                        {loading ? 'Gönderiliyor...' : 'Kaydet ve Gönder'}
                    </button>
                    <button type="button" className="secondary" onClick={onCancel} disabled={loading}>İptal</button>
                </div>
            </form>

            {message && <div className="msg success">{message}</div>}
            {error && <div className="msg error">{error}</div>}
            <div className="hint">
                İpucu: Klavyeden P tuşuna basarak poligon çizim modunu aç/kapat.
            </div>
        </aside>
    );
}
