import { useEffect } from 'react';



function useIsOpen(isOpen) {
    useEffect(() => {
        if (isOpen) {
            document.getElementById('query-table-screen').style.display = 'block';
        }
        else {
            document.getElementById('query-table-screen').style.display = 'none';
        }
    }, [isOpen]);

}



export { useIsOpen };