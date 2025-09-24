import './style/query-table-screen.css';
import { useIsOpen } from './hooks/useIsOpen';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';






export default function QueryTableScreen({ isOpen , onClose}) {



    useIsOpen(isOpen);






    return (
        <div id='query-table-screen'>
            <div id="query-table-screen-container"> 
                <div id="query-table-screen-header">
                    <h2>Sorgu Paneli Ekranı</h2>
                    <button id="closeButton" type="button" onClick={onClose}>X</button>
                </div>
                <div id="query-table-screen-body">
                    <DataTable value={[{id:1, name:'John', age:30}, {id:2, name:'Jane', age:25}]} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" header="ID"></Column>
                        <Column field="name" header="Name"></Column>
                        <Column field="age" header="Age"></Column>
                    </DataTable>
                </div>
                <div id="query-table-screen-footer">
                    <p>Footer</p>
                </div>
            </div>
        </div>



    );
}