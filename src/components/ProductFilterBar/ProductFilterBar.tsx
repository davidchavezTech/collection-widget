import type { Dispatch, RefObject, SetStateAction } from "react";
import type { ProductFilterBarProps } from "../productFilter/ProductFilter";
import type { FilterList } from "../../types/shopify";
import DownSVG from "../svg/DownArrow";
import FilterSVG from "../svg/FilterSVG";

interface Props extends ProductFilterBarProps {
    openDrawer: () => void;
    clearFiltersButtonRef: RefObject<HTMLButtonElement | null>;
    setSelectedFilter: Dispatch<SetStateAction<string>>;
    filtersList: FilterList[];
    handlePriceFilter: (highest: boolean) => void;
}

const ProductFilterBar = ({
    sortBy,
    reverse,
    handleClearFilters,
    openDrawer,
    clearFiltersButtonRef,
    setSelectedFilter,
    filtersList,
    handlePriceFilter
}: Props) => {

    const handleFilterButtonClick = (selectedFilterName: string) => {
        setSelectedFilter(selectedFilterName);
        openDrawer();
    }

    return (
        <div className="tw:flex tw:justify-end tw:lg:justify-between tw:bg-white tw:text-gray-900 tw:py-4">
            {/* Desktop (lg and up) */}
            <div className="tw:hidden tw:lg:flex tw:gap-8">
                {filtersList.map((filterList) => (
                <button
                    className="tw:flex tw:items-center tw:space-x-2 tw:px-3 tw:py-2 tw:cursor-pointer"
                    onClick={() => handleFilterButtonClick(filterList.name)}
                    key={filterList.name}
                >
                    <span className="tw:text-sm">{filterList.name}</span>
                    <DownSVG className="tw:translate-y-[2px]" width={10} />
                </button>
                ))}
            </div>
            <div className="tw:hidden tw:lg:flex tw:gap-4">
                <button className="tw:cursor-pointer tw:bg-gray-800 tw:text-white tw:px-4" onClick={handleClearFilters} ref={clearFiltersButtonRef}>Clear filters</button>
                <button className={`tw:cursor-pointer tw:px-2 tw:py-1 tw:border ${sortBy === 'PRICE' && reverse ? 'tw:border-gray-400' : 'tw:border-transparent'}`} onClick={() => handlePriceFilter(true)}>Highest</button>
                <button className={`tw:cursor-pointer tw:px-2 tw:py-1 tw:border ${sortBy === 'PRICE' && !reverse ? 'tw:border-gray-400' : 'tw:border-transparent'}`} onClick={() => handlePriceFilter(false)}>Lowest</button>
            </div>

            {/* Mobile (below lg) */}
            <div className="tw:flex tw:lg:hidden tw:gap-4 tw:mr-4">
                <button
                    className="tw:flex tw:items-center tw:gap-2 tw:bg-gray-800 tw:text-white tw:px-3 tw:py-1 tw:cursor-pointer"
                    onClick={() => openDrawer()}
                >
                    Filters
                    <FilterSVG width={15} />
                </button>
            </div>
        </div>
    );
};

export default ProductFilterBar;