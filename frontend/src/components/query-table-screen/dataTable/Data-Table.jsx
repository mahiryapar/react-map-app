import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import useDataFetch from './hooks/useDataFetch';
import useSearch from './hooks/useSearch';




export default function Data_Table({ isOpen , onClickRow}) {
    const [totalRecords, setTotalRecords] = useState(0);
    const [list, setList] = useState([]);
    const [lazy, setLazy] = useState({
        first: 0,
        rows: 5,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    });
    const [searchValue, setSearchValue] = useState('');

    const onPage = (e) => {
        setLazy((prev) => ({ ...prev, first: e.first, rows: e.rows }));
    };
    const onSort = (e) => {
        setLazy((prev) => ({ ...prev, sortField: e.sortField, sortOrder: e.sortOrder }));
    };

    useSearch(setLazy, searchValue);
    useDataFetch(isOpen, lazy, setList, setTotalRecords, searchValue);

    const onRowClick = (e) => {
        onClickRow(e.data);
    };

    const actionBodyTemplate = (rowData) => (
        <Button
            id="go_on_map"
            icon="pi pi-pencil"
            className="p-button-sm"
            onClick={(e) => {
                onClickRow(rowData);
            }}
        />
    );

    const header = (
        <div className="p-d-flex p-ai-center p-jc-between" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Kayıtlar</h3>
            <span className="p-input-icon-left" style={{ marginLeft: 'auto' }}>
                <i style={{ color: '#6B7280', marginLeft: '230px' }} className="pi pi-search" />
                <InputText
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value) }
                    placeholder="Ara..."
                    style={{ width: 'min(260px, 40vw)' }}
                />
            </span>
        </div>
    );



    return (
    <DataTable
        header={header}
        value={list}
        paginator
        showGridlines
        responsiveLayout="scroll"
        tableStyle={{ width: '100%' }}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        lazy first={lazy.first} rows={lazy.rows} sortField={lazy.sortField} sortOrder={lazy.sortOrder}
        filters={lazy.filters} onPage={onPage} onSort={onSort} totalRecords={totalRecords}
    >
            <Column style={{ textAlign: 'center', width: '80px' }} header="İncele" body={actionBodyTemplate} frozen alignFrozen="left"></Column>
            <Column field="id" header="ID" style={{ width: '100px' }}></Column>
            <Column field="ad" header="Ad" body={(d) => <span className="truncate" title={d.ad}>{d.ad}</span>}></Column>
            <Column field="tur" header="Tür" style={{ width: '120px' }}></Column>
            <Column field="daire_sayisi" header="Daire Sayısı" style={{ width: '140px' }}></Column>
            <Column field="numarataj" header="Numarataj" style={{ width: '140px' }}></Column>
            <Column field="aciklama" header="Açıklama" body={(d) => <span className="truncate" title={d.aciklama}>{d.aciklama}</span>}></Column>
        </DataTable>
    );
}