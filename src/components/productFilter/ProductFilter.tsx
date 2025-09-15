import type { Dispatch, SetStateAction } from "react";
import ProductFilterBar from "../ProductFilterBar/ProductFilterBar";
import ProductFilterDrawer from "../productFilterDrawer/ProductFilterDrawer";
import type { FilterList, SortBy } from "../../types/shopify";
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
    handleClearFilters: HandleClearFilters
}

export interface ProductFilterDrawerProps {
    filtersList: FilterList[]
}

interface ProductFilter extends ProductFilterBarProps, ProductFilterDrawerProps {}

const ProductFilter = ({
    setSortBy,
    setReverse,
    sortBy,
    reverse,
    handleClearFilters,
    filtersList
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
                    filtersList,
                    selectedFilter,
                    setSelectedFilter,
                    sortBy,
                    reverse,
                    handlePriceFilter,
                    handleClearFilters,
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
                    filtersList,
                    handlePriceFilter
                }}
            />
        </>
    );
};

export default ProductFilter;