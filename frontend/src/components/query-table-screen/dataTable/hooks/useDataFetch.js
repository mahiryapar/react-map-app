import { useEffect } from "react";
import { fetchDataTable } from "../../../../services/api";

export default function useDataFetch(isOpen, lazy, setList, setTotalRecords, searchValue) {
    useEffect(() => {
        if (!isOpen) return;

        const controller = new AbortController();
        fetchDataTable({ signal: controller.signal, search: searchValue, first: lazy.first, rows: lazy.rows, sortField: lazy.sortField, sortOrder: lazy.sortOrder })
            .then(resp => {
                setList(resp.data ?? []);
                setTotalRecords(resp.total ?? 0);
            })
            .catch(error => {
                if (error.name !== 'AbortError') console.error(error);
            });

        return () => controller.abort();
    }, [isOpen,lazy.first, lazy.rows, lazy.sortField, lazy.sortOrder,searchValue]);
}