import './style/query-table-screen.css';
import { useIsOpen } from './hooks/useIsOpen';
import Data_Table from './dataTable/Data-Table';





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
                    <Data_Table isOpen={isOpen} />
                </div>
            </div>
        </div>



    );
}