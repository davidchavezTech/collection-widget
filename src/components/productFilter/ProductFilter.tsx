import type { Dispatch, SetStateAction } from "react";
import ProductFilterBar from "../ProductFilterBar/ProductFilterBar";
import ProductFilterDrawer from "../productFilterDrawer/ProductFilterDrawer";
import type { Filters, FiltersAction, SortBy } from "../../types/shopify";
import useProductFilterDrawer from "./useProductFilterDrawer";

type SetSortBy = Dispatch<SetStateAction<SortBy>>;
type SetReverse = Dispatch<SetStateAction<boolean>>;
type Reverse = boolean;
type HandleClearFilters = () => void;

export interface ProductFilterBarProps {
    setSortBy: SetSortBy
    setReverse: SetReverse
    sortBy: SortBy
    reverse: Reverse
    handleClearFilters: HandleClearFilters,
    filters: Filters
}

export interface ProductFilterDrawerProps {
    filters: Filters,
    dispatch: Dispatch<FiltersAction>
}

interface ProductFilter extends ProductFilterBarProps, ProductFilterDrawerProps {}

const ProductFilter = ({
    setSortBy,
    setReverse,
    sortBy,
    reverse,
    handleClearFilters,
    filters,
    dispatch
}: ProductFilter) => {

    const handlePriceFilter = (highest: boolean) => {
        if(reverse === highest && sortBy) {
            setSortBy(undefined);
            setReverse(false);
            return;
        };
        setSortBy("PRICE");
        setReverse(highest);
    };

    const {
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        drawerRef,
        clearFiltersButtonRef,
        selectedFilter,
        setSelectedFilter
    } = useProductFilterDrawer();

    return (
        <>
            <ProductFilterDrawer
                {...{
                    isDrawerOpen,
                    closeDrawer,
                    drawerRef,
                    filters,
                    selectedFilter,
                    setSelectedFilter,
                    sortBy,
                    reverse,
                    handlePriceFilter,
                    handleClearFilters,
                    dispatch
                }}
            />
            <ProductFilterBar
                {...{
                    setSortBy,
                    setReverse,
                    sortBy,
                    reverse,
                    handleClearFilters,
                    openDrawer,
                    clearFiltersButtonRef,
                    setSelectedFilter,
                    filters,
                    handlePriceFilter
                }}
            />
        </>
    );
};

export default ProductFilter;