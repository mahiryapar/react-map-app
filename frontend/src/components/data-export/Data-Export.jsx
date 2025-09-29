import React, { use } from 'react';
import './style/Data-Export.css';
import { useIsOpen } from './hooks/useIsOpen.js';
import {exportPDF , exportExcel} from './export-functions.js';



export default function DataExport({ isOpen, onClose }) {

    useIsOpen(isOpen);

    const ExportData = async () => {
        const format = document.getElementById('data-export-format').value;
        if (format === 'pdf') {
            await exportPDF();
        } else if (format === 'excel') {
            await exportExcel();
        }
    };

    return (
        <div id="data-export-container">
            <div id="data-export-content">
                <div id="data-export-header">
                    <h2>Veri İndir</h2>
                </div>
                <div id="data-export-body">
                    <p>Veri dışa aktarma seçeneğini seçiniz.</p>
                    <select id="data-export-format">
                        <option value="excel">Excel</option>
                        <option value="pdf">PDF</option>
                    </select>
                </div>
                <div id="data-export-footer">
                    <button id="data-export-export-button" onClick={ExportData}>Dışa Aktar</button>
                    <button id="data-export-cancel-button" onClick={onClose}>İptal</button>
                </div>
            </div>
        </div>
    );

}