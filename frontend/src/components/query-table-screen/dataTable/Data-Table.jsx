import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import useDataFetch from './useDataFetch';
import { set } from 'ol/transform';


export default function Data_Table({ isOpen , onClickRow}) {
    const [totalRecords, setTotalRecords] = useState(0);
    const [list, setList] = useState([]);
    const [lazy, setLazy] = useState({
        first: 0,
        rows: 10,
        sortField: null,
        sortOrder: null,
    });

    const onPage = (e) => {
        setLazy((prev) => ({ ...prev, first: e.first, rows: e.rows }));
    };
    const onSort = (e) => {
        setLazy((prev) => ({ ...prev, sortField: e.sortField, sortOrder: e.sortOrder }));
    };

    useDataFetch(isOpen, lazy, setList, setTotalRecords);

    const onRowClick = (e) => {
        onClickRow(e.data);
    }



    return (
    <DataTable onRowClick={onRowClick} value={list} tableStyle={{ minWidth: '50rem' }} paginator showGridlines
        lazy first={lazy.first} rows={lazy.rows} sortField={lazy.sortField} sortOrder={lazy.sortOrder}
        onPage={onPage} onSort={onSort} totalRecords={totalRecords}>
            <Column style={{cursor: 'pointer'}} field="id" header="ID"></Column>
            <Column style={{cursor: 'pointer'}} field="ad" header="Ad"></Column>
            <Column style={{cursor: 'pointer'}} field="tur" header="Tür"></Column>
            <Column style={{cursor: 'pointer'}} field="numarataj" header="Numarataj"></Column>
            <Column style={{cursor: 'pointer'}} field="aciklama" header="Açıklama"></Column>
        </DataTable>
    );
}