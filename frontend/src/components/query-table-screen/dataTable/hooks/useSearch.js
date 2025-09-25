import { useEffect, useRef } from 'react';

export default function useSearch(setLazy, searchValue) {
    const debounceRef = useRef();

    useEffect(() => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            debounceRef.current = setTimeout(() => {
                setLazy((prev) => ({
                    ...prev,
                    first: 0, // reset to first page
                    filters: {
                        ...prev.filters,
                        global: { ...prev.filters.global, value: searchValue || null }
                    }
                }));
            }, 400);
            return () => clearTimeout(debounceRef.current);
        }, [searchValue]);
    
}