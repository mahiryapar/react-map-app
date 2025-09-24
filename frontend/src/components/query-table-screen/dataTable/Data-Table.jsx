import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import useDataFetch from './useDataFetch';


export default function Data_Table({ isOpen }) {
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


    return (
    <DataTable value={list} tableStyle={{ minWidth: '50rem' }} paginator showGridlines
        lazy first={lazy.first} rows={lazy.rows} sortField={lazy.sortField} sortOrder={lazy.sortOrder}
        onPage={onPage} onSort={onSort} totalRecords={totalRecords}>
            <Column field="id" header="ID"></Column>
            <Column field="ad" header="Ad"></Column>
            <Column field="tur" header="Tür"></Column>
            <Column field="numarataj" header="Numarataj"></Column>
            <Column field="aciklama" header="Açıklama"></Column>
        </DataTable>
    );
}