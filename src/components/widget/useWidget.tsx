import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { graphQLProductRequest } from "../../api/shopify";
import type {
    Product,
    ProductResponseEdge,
    ProductsResponse,
    SortBy,
    CurrencySymbolObject,
    Filter,
    Filters,
    FiltersAction
} from "../../types/shopify";
import { PRODUCTS_QUERY } from "../../graphQL/queries/products";

interface PushParams {
    filterName: string, isSelected: boolean, option: string
}

const PAGE_SIZE = 20;
const SCROLL_FETCH_THRESHOLD = 300;

const SAMPLE_VENDORS_DATA = {
    "Barbour x Tuckernuck": false,
    "Hyacinth House": false,
    "MOTHER": false,
    "Tuckernuck": false
};

const SAMPLE_PRODUCT_TYPE_DATA = {
    "cardigans": false,
    "Dresses": false,
    "Rain Umbrellas": false,
    "shawls": false,
    "shoes": false
};

const FILTERS_LIST: Filters = {  //Keys must match the variable name from the JSON initialization data in the liquid file
    vendors: {
        filterName: "Brands",
        graphQLId: 'vendor',
        state: import.meta.env.MODE === "development" ? SAMPLE_VENDORS_DATA : {}, // We need hard coded values for development since we can't rely on shopify's data
    },
    productTypes: {
        filterName: "Product Type",
        graphQLId: 'product_type',
        state: import.meta.env.MODE === "development" ? SAMPLE_PRODUCT_TYPE_DATA : {}, // We need hard coded values for development since we can't rely on shopify's data
    }
}

const initiateFiltersList = (initialArgs: Filters | undefined): Filters => {
    if(!initialArgs) return {};
    try {
        const isDevMode = import.meta.env.MODE === 'development';
        if(isDevMode) {
            const _initialArgs = JSON.parse(JSON.stringify(initialArgs));

            const params = new URLSearchParams(window.location.search);
            const currentParamsArr: string[] = [];

            for (const [key] of params) {
                currentParamsArr.push(key)
            };

            Object.keys(_initialArgs).forEach((key) => { // Iterate through venders and productTYpes
                const currentFilter = _initialArgs[key];
                const filterState = currentFilter.state;

                currentParamsArr.forEach((currentParam: string) => {
                    if(Object.keys(filterState).includes(currentParam)) {
                        filterState[currentParam] = true;
                    }
                });
            });

            return _initialArgs
        };

    
        const scriptElement = document.getElementById('frenzy-data') as HTMLScriptElement;
    
        const extractDataFromScriptElement = (scriptElement: HTMLScriptElement): Record<string, string[]> => {
            const isJSON = (string: string): boolean => {
                try {
                    if(JSON.parse(string)) return true;
                    else return false;
                } catch {
                    return false;
                }
            };
            
            if(!scriptElement.textContent) return {};
            if(!isJSON(scriptElement.textContent)) return {};
    
            return JSON.parse(scriptElement.textContent);
        };
    
        if(scriptElement) {
            const shopifyFiltersObj: Record<string, string[]> = extractDataFromScriptElement(scriptElement);
    
            // Assign state to each filter from initialArgs
            const updatedFilters: Filters = Object.fromEntries(
                Object.entries(shopifyFiltersObj).map(([key, filterValuesList]) => {
                    const newState: Record<string, boolean> = Object.fromEntries(
                        filterValuesList.map(value => [value, false])
                    );
                    const currentFilter = initialArgs[key] ?? {};
    
                    if (!currentFilter) {
                        throw new Error(`Missing filter config for key: ${key}`);
                    };
    
                    return [
                        key, 
                        {
                            ...currentFilter,
                            state: newState
                        }
                    ];
                })
            );
    
            return updatedFilters;
    
        } else return {};
    } catch {
        return {};
    }
};

function toggleFilter(filter: Filter, key: string): Filter {
    return {
        ...filter,
        state: {
            ...filter.state,
            [key]: !filter.state[key],
        },
    };
}

const filtersListReducer = (prevState: Filters, action: FiltersAction) => {
    const { type, payload } = action;
    const pushParams = ({isSelected, option}: PushParams) => {
        
        const params = new URLSearchParams(window.location.search);

        if(isSelected) params.set(option, "open");
        else params.delete(option);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
    }

    switch (type) {
        case "TOGGLE_FILTER": {
            if(!payload) return prevState;
            const filter = prevState[payload.filterName];
            if (!filter) return prevState;
            const { filterName } = payload;
            const isSelected = !filter.state[payload.key];
            const option = payload.key;

            pushParams({
                filterName,
                isSelected,
                option
            });

            return {
                ...prevState,
                [payload.filterName]: toggleFilter(filter, payload.key),
            };
        };
        case "CLEAR_FILTER": {
            
            const cleared = Object.fromEntries(
                Object.entries(prevState).map(([filterName, filter]) => [
                    filterName,
                    {
                        ...filter,
                        state: Object.fromEntries(
                            Object.keys(filter.state).map((key) => [key, false])
                        ),
                    },
                ])
            ) as Filters;
                
            return cleared;
        }
        default:
            return prevState;
    }
}

const useWidget = () => {
    const [ products, setProducts ] = useState<Product[]>(Array.from({length: PAGE_SIZE}).map((_, index) => ({
        id: `dummy-product-${index}`,
        title: '',
        handle: `dummy-handle`,
        vendor: '',
        images: {
            edges: []
        },
        variants: {
            edges: [{
                node: {
                    priceV2: {
                        amount: "",
                        currencyCode: ""
                    }
                }
            }]
        }
    })));
    const [ loading, setLoading ] = useState(true);
    const [ loadingMoreProducts, setLoadingLoadingMoreProducts ] = useState(false);
    const [ cursor, setCursor ] = useState<string | null>(null);
    const [ hasNextPage, setHasNextPage ] = useState(true);
    const [ filters, dispatch ] = useReducer(filtersListReducer, FILTERS_LIST, initiateFiltersList);
    const [ sortBy, setSortBy ] = useState<SortBy>();
    const [ reverse, setReverse ] = useState(false);
    const [ availableCurrencySymbols, setAvailableCurrencySymbols ] = useState<CurrencySymbolObject[]>([]);
    const [ error, setError ] =useState(false);

    const abortController = useRef<AbortController | null>(null);
    const initialllyLoadedRef = useRef(false);

    function buildProductFilters(filters: Filters): string {
        const queryParts: string[] = [];
        Object.keys(filters).forEach((filterKey) => {
            const selectedFilter = filters[filterKey];
            const selectedFilteredItems = Object.entries(selectedFilter.state)
                .filter(([, checked]) => checked)
                .map(([option]) => `${selectedFilter.graphQLId}:"${option}"`);
            if (selectedFilteredItems.length > 0) queryParts.push(`(${selectedFilteredItems.join(" OR ")})`);
        })
      
        return queryParts.join(" AND ");
    }

    const handleClearFilters = () => {
        const thereAreNoActiveFilters = !(sortBy || reverse || Object.keys(filters).some(filterKey => 
            Object.keys(filters[filterKey].state).some(key => filters[filterKey].state[key])
        ));

        if(thereAreNoActiveFilters) return;
        
        dispatch({type: "CLEAR_FILTER"})
        setSortBy(undefined);
        setReverse(false);
    }

    const fetchProducts = useCallback(
        async (options: { append?: boolean } = {}) => {
            const { append = false } = options;

            if(append && (loading || loadingMoreProducts)) return;

            abortController.current?.abort();
            abortController.current = new AbortController();
            const signal = abortController.current.signal;

            // If appending but no next page or currently loading, return early
            if (append && !hasNextPage) return;

            if(!initialllyLoadedRef.current || !append) setLoading(true);
            else if(append) setLoadingLoadingMoreProducts(true);

            try {
                const searchQuery = buildProductFilters(filters);

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
        [cursor, hasNextPage, loading, sortBy, reverse, filters, loadingMoreProducts]
    );

    useEffect(() => {
        fetchProducts({ append: false });

        return () => {
            abortController.current?.abort();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, sortBy, reverse]);

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
        filters,
        loadingMoreProducts,
        initialllyLoadedRef,
        dispatch
    };
};

export default useWidget;
