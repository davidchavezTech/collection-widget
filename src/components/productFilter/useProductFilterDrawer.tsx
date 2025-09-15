import { useEffect, useRef, useState } from "react";

const useProductFilterDrawer = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [ selectedFilter, setSelectedFilter ] = useState('');
    
    const drawerRef = useRef<HTMLDivElement>(null);
    const clearFiltersButtonRef = useRef<HTMLButtonElement>(null);

    const openDrawer = () => {
        const params = new URLSearchParams(window.location.search);
        params.set("drawer", "open");

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ drawer: "open" }, "", newUrl);

        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        const params = new URLSearchParams(window.location.search);
        params.delete("drawer");

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);

        setIsDrawerOpen(false);
        clearFiltersButtonRef.current?.focus();
    };

    useEffect(() => {
        if (!open) return;
    
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            closeDrawer();
          }
          if (e.key === "Tab" && drawerRef.current) {
            const focusableEls = drawerRef.current.querySelectorAll<HTMLElement>(
              'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
            );
            const first = focusableEls[0];
            const last = focusableEls[focusableEls.length - 1];
    
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        };
    
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }, [isDrawerOpen]);
    
      // Trap initial focus
      useEffect(() => {
        if (isDrawerOpen && drawerRef.current) {
          const firstFocusable = drawerRef.current.querySelector<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }
      }, [isDrawerOpen]);
    

    useEffect(() => {
        const onPopState = () => {
            const params = new URLSearchParams(window.location.search);
            setIsDrawerOpen(params.get("drawer") === "open");
        };

        window.addEventListener("popstate", onPopState);

        // Run once on mount so refresh respects the URL
        onPopState();

        return () => {
            window.removeEventListener("popstate", onPopState);
        };
    }, []);

    return {
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        drawerRef,
        clearFiltersButtonRef,
        selectedFilter,
        setSelectedFilter
    };
};

export default useProductFilterDrawer;
