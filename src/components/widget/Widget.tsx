import useWidget from "./useWidget";
import ProductGrid from "../productGrid/ProductGrid";
import ProductFilter from "../productFilter/ProductFilter";

const Widget = () => {
    
    const {
        products,
        loading,
        setSortBy,
        setReverse,
        sortBy,
        reverse,
        availableCurrencySymbols,
        filters,
        handleClearFilters,
        error,
        loadingMoreProducts,
        initialllyLoadedRef,
        dispatch
    } = useWidget();

    return (
        <div className="tw:max-w-[1600px] tw:mx-auto">
            {Object.keys(filters).length ? <ProductFilter {...{
                setSortBy,
                setReverse,
                sortBy,
                reverse,
                handleClearFilters,
                filters,
                dispatch
            }} /> : ''}
            
            <ProductGrid
                {...{
                    loading,
                    products,
                    availableCurrencySymbols,
                    error,
                    loadingMoreProducts,
                    initialllyLoadedRef
                }}
                
            />
        </div>
    );
};

export default Widget;
