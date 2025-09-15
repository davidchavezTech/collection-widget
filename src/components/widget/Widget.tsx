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
        filtersList,
        handleClearFilters,
        error,
        loadingMoreProducts,
        initialllyLoadedRef
    } = useWidget();

    return (
        <div className="tw:max-w-[1600px] tw:mx-auto">
            {filtersList.length ? <ProductFilter {...{
                setSortBy,
                setReverse,
                sortBy,
                reverse,
                handleClearFilters,
                filtersList
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
