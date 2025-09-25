import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
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
        rows: 10,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    });
    const [searchValue, setSearchValue] = useState('');
    const debounceRef = useRef();

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

    const header = (
        <div className="p-d-flex p-ai-center p-jc-between" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>Kayıtlar</h3>
            <span className="p-input-icon-left" style={{ marginLeft: 'auto' }}>
                <i className="pi pi-search" style={{ marginLeft: '190px' }} />
                <InputText
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value) }
                    placeholder="Ara..."
                    style={{ width: '220px' }}
                />
            </span>
        </div>
    );



    return (
    <DataTable header={header} onRowClick={onRowClick} value={list} tableStyle={{ minWidth: '50rem' }} paginator showGridlines
        lazy first={lazy.first} rows={lazy.rows} sortField={lazy.sortField} sortOrder={lazy.sortOrder}
        filters={lazy.filters} onPage={onPage} onSort={onSort} totalRecords={totalRecords}>
            <Column style={{cursor: 'pointer'}} field="id" header="ID"></Column>
            <Column style={{cursor: 'pointer'}} field="ad" header="Ad"></Column>
            <Column style={{cursor: 'pointer'}} field="tur" header="Tür"></Column>
            <Column style={{cursor: 'pointer'}} field="numarataj" header="Numarataj"></Column>
            <Column style={{cursor: 'pointer'}} field="aciklama" header="Açıklama"></Column>
        </DataTable>
    );
}