import { useEffect } from "react";

export function useIsOpen(isOpen) {
    useEffect(() => {
        const element = document.getElementById('data-export-container');
        if (isOpen) {
            element?.classList.add('open');
        } else {
            element?.classList.remove('open');
        }
    }, [isOpen]);
}

