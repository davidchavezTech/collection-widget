import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { graphQLProductRequest } from "../../api/shopify";
import type {
    Product,
    ProductResponseEdge,
    ProductsResponse,
    SortBy,
    CurrencySymbolObject,
    FilterList
} from "../../types/shopify";
import { PRODUCTS_QUERY } from "../../graphQL/queries/products";

const PAGE_SIZE = 20;
const SCROLL_FETCH_THRESHOLD = 300;

const useWidget = () => {
    const [ products, setProducts ] = useState<Product[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ loadingMoreProducts, setLoadingLoadingMoreProducts ] = useState(false);
    const [ cursor, setCursor ] = useState<string | null>(null);
    const [ hasNextPage, setHasNextPage ] = useState(true);
    const [ selectedBrands, setSelectedBrands ] = useState<Record<string, boolean>>(
            import.meta.env.MODE === "development" ? {
            "Barbour x Tuckernuck": false,
            "Hyacinth House": false,
            "MOTHER": false,
            "Tuckernuck": false
        } : {}
    );
    const [ selectedProductTypes, setSelectedProductTypes ] = useState<Record<string, boolean>>(
        import.meta.env.MODE === "development" ? {
            "cardigans": false,
            "Dresses": false,
            "Rain Umbrellas": false,
            "shawls": false,
            "shoes": false
        } : {}
    );
    const [ sortBy, setSortBy ] = useState<SortBy>();
    const [ reverse, setReverse ] = useState(false);
    const [ availableCurrencySymbols, setAvailableCurrencySymbols ] = useState<CurrencySymbolObject[]>([]);
    const [ error, setError ] =useState(false);

    const abortController = useRef<AbortController | null>(null);
    const initialllyLoadedRef = useRef(false);

    const filtersList: FilterList[] = useMemo(() => [
        {
            id: "vendors",
            name: "Brands",
            queryId: 'vendor',
            state: selectedBrands,
            stateSetter: setSelectedBrands
        },
        {
            id: "productTypes",
            name: "Product Type",
            queryId: 'product_type',
            state: selectedProductTypes,
            stateSetter: setSelectedProductTypes
        }
    ], [selectedBrands, selectedProductTypes]);

    function buildProductFilters(filtersList: FilterList[]): string {
        const queryParts: string[] = [];
        filtersList.forEach((filterList) => {
            const selectedFilteredItems = Object.entries(filterList.state)
                .filter(([, checked]) => checked)
                .map(([option]) => `${filterList.queryId}:"${option}"`);
            if (selectedFilteredItems.length > 0) queryParts.push(`(${selectedFilteredItems.join(" OR ")})`);
        })
      
        return queryParts.join(" AND ");
    }

    const handleClearFilters = () => {
        const thereAreNoActiveFilters = !(sortBy || reverse || filtersList.some(filterList => 
            Object.keys(filterList.state).some(key => filterList.state[key])
        ));

        if(thereAreNoActiveFilters) return;
        
        filtersList.forEach(filterList => {
            filterList.stateSetter(current => {
                Object.keys(current).forEach((key: string) => current[key] = false);
                return {...current};
            });
        })
        setSortBy(undefined);
        setReverse(false);
    }

    const fetchProducts = useCallback(
        async (options: { append?: boolean } = {}) => {
            const { append = false } = options;
            
            abortController.current?.abort();
            abortController.current = new AbortController();
            const signal = abortController.current.signal;

            // If appending but no next page or currently loading, return early
            if (append && (!hasNextPage || loading)) return;
            
            if(append) setLoadingLoadingMoreProducts(true);
            setLoading(true);

            try {
                const searchQuery = buildProductFilters(filtersList);

                const variables = {
                    first: PAGE_SIZE,
                    after: append ? cursor : null,
                    query: searchQuery || undefined,
                    sortKey: sortBy,
                    reverse: reverse,
                  };

                const data = await graphQLProductRequest<ProductsResponse>(
                    PRODUCTS_QUERY,
                    variables,
                    signal
                );

                const newProducts = data.products.edges.map(
                    (edge: ProductResponseEdge) => edge.node
                );

                setAvailableCurrencySymbols(data.localization.availableCountries);
                setProducts((prev) =>
                    append ? [...prev, ...newProducts] : newProducts
                );
                setCursor(data.products.pageInfo.endCursor);
                setHasNextPage(data.products.pageInfo.hasNextPage);
                setError(false);
                initialllyLoadedRef.current = true;

                const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
                if (scrollTop + clientHeight >= scrollHeight - SCROLL_FETCH_THRESHOLD && data.products.pageInfo.hasNextPage) {
                    fetchProducts({ append: true });
                }
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    setError(true);
                    console.error("Error fetching products:", error);
                }
            } finally {
                setLoading(false);
                setLoadingLoadingMoreProducts(false);
            }
        },
        [cursor, hasNextPage, loading, sortBy, reverse, filtersList]
    );

    useEffect(() => {
        fetchProducts({ append: false });

        return () => {
            abortController.current?.abort();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProductTypes, selectedBrands, sortBy, reverse]);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
            if (scrollTop + clientHeight >= scrollHeight - SCROLL_FETCH_THRESHOLD) {
                fetchProducts({ append: true });
            }
        };
    
        window.addEventListener("scroll", handleScroll);
    
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [fetchProducts]);

    useEffect(() => {
        // Extract brands and product types from html script tag
        const loadFiltersList = () => {
            const scriptElement = document.getElementById('frenzy-data') as HTMLScriptElement;
    
            const isJSON = (string: string): boolean => {
                try {
                    if(JSON.parse(string)) return true;
                    else return false;
                } catch {
                    return false;
                }
            };
    
            const extractDataFromScriptElement = (scriptElement: HTMLScriptElement) => {
                if(!scriptElement.textContent) return {};
                if(!isJSON(scriptElement.textContent)) return {};
    
                return JSON.parse(scriptElement.textContent);
            }
    
            if(scriptElement) {
                const data = extractDataFromScriptElement(scriptElement);

                Object.keys(data).forEach((key:string) => {
                    const filterList = filtersList.find(filterList => filterList.id === key);

                    if(filterList) {
                        const valuesArray:string[] = data[key];
                        const newFilterList: Record<string, boolean> = {};
                        valuesArray.forEach(value => newFilterList[value] = false);
                        filterList.stateSetter(newFilterList);
                    };
                });
            };
        };

        loadFiltersList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        products,
        loading,
        hasNextPage,
        setSortBy,
        setReverse,
        sortBy,
        reverse,
        availableCurrencySymbols,
        handleClearFilters,
        error,
        filtersList,
        loadingMoreProducts,
        initialllyLoadedRef
    };
};

export default useWidget;
