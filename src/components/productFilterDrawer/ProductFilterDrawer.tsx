import React, { type Dispatch, type RefObject, type SetStateAction } from "react";

import type { ProductFilterDrawerProps } from "../productFilter/ProductFilter";
import { createPortal } from "react-dom";
import type { Filters, SortBy } from "../../types/shopify";
import DownSVG from "../svg/DownArrow";

interface Props extends ProductFilterDrawerProps {
    isDrawerOpen: boolean;
    closeDrawer: () => void;
    drawerRef: RefObject<HTMLDivElement | null>;
    filters: Filters;
    selectedFilter: string
    setSelectedFilter: Dispatch<SetStateAction<string>>
    sortBy: SortBy;
    reverse: boolean;
    handlePriceFilter: (highest: boolean) => void
    handleClearFilters: () => void
}

const ProductFilterDrawer = ({
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
}: Props) => {
    

    const handleSelectedFilter = (filterName: string, selection: string) => {
        dispatch({type: "TOGGLE_FILTER", payload: {filterName, key: selection}})
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const clickedElement = e.target as HTMLElement;;

        if(clickedElement.id === 'product-filter-drawer-backdrop') closeDrawer();
    };

    return (
        createPortal(
            <div
                id="product-filter-drawer-backdrop"
                className={`${
                    isDrawerOpen ? "tw:opacity-100" : "tw:pointer-events-none tw:opacity-0"
                } tw:fixed tw:top-0 tw:w-screen tw:h-screen tw:left-0 tw:transform tw:transition-opacity tw:duration-300 tw:z-10 tw:backdrop-blur-[2px] tw:bg-gray-600/30`}
                onClick={handleBackdropClick}
                ref={drawerRef}
            >
                <div
                    className={`tw:absolute tw:left-0 ${
                        isDrawerOpen ? "tw:translate-x-0" : "tw:-translate-x-full"
                    } tw:transition-transform tw:w-80 tw:bg-white tw:shadow-lg tw:h-screen`}
                >
                    <div className="overflow-y-scroll">
                        {/* Header */}
                        <div className="tw:p-4 tw:pt-0">
                            <div className="tw:border-b tw:border-gray-300 tw:py-3 tw:flex tw:justify-between tw:items-center">
                                <h2 className="tw:text-lg tw:w-full">
                                    All Filters
                                </h2>
                                <button
                                    onClick={() => closeDrawer()}
                                    className="tw:text-gray-600 tw:hover:text-black tw:text-2xl tw:cursor-pointer tw:px-4 tw:py-2"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Filters list */}
                        
                            {
                                Object.entries(filters).map(([filterName,filterList]) => (
                                    <div className="tw:px-4 tw:mb-2" key={filterList.filterName}>
                                        <h3
                                            className="tw:flex tw:justify-between tw:text-base tw:font-medium tw:mb-2 tw:border-b tw:border-gray-300 tw:py-3 tw:pt-0 tw:cursor-pointer"
                                            onClick={() =>
                                                setSelectedFilter(
                                                    selectedFilter === filterList.filterName ? '' : filterList.filterName
                                                )
                                            }
                                            // style={{fontSize: 18}}
                                        >
                                            {filterList.filterName}
                                            <DownSVG width={15} className={`tw:mr-4 tw:transform tw:transition-transform tw:duration-300 ${selectedFilter === filterList.filterName ? 'tw:rotate-180' : 'tw:rotate-0'}`} />
                                        </h3>
                                        <div
                                            className={`tw:transition-all tw:duration-600 tw:ease-in-out tw:overflow-hidden ${
                                            selectedFilter === filterList.filterName ? "tw:max-h-96 tw:opacity-100" : "tw:max-h-0 tw:opacity-0"
                                            }`}
                                        >
                                            <div className="tw:space-y-2 tw:py-4">
                                                {Object.keys(filterList.state).map((optionName) => (
                                                    <label
                                                        key={optionName}
                                                        className="tw:flex tw:items-center tw:space-x-2 tw:cursor-pointer tw:ml-1"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={filterList.state[optionName]}
                                                            onChange={() => handleSelectedFilter(filterName, optionName)}
                                                            onFocus={() => setSelectedFilter(filterList.filterName)}
                                                        />
                                                        <span>{optionName}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                    </div>

                    {/* Mobile (below lg) -- Footer */}
                    <div className="tw:lg:hidden tw:flex tw:flex-col tw:px-4">
                        <h3
                            className="tw:text-base tw:font-medium tw:mb-2 tw:border-b tw:border-gray-300 tw:py-3 tw:pt-0 tw:cursor-pointer"
                        >
                            Price
                        </h3>
                        <label
                            className="tw:flex tw:items-center tw:space-x-2 tw:cursor-pointer tw:border tw:px-2 tw:py-1 tw:border-gray-300 tw:mb-2"
                        >
                            <input
                                type="checkbox"
                                checked={sortBy === 'PRICE' && reverse}
                                onChange={() => handlePriceFilter(true)}
                            />
                            <span className="tw:px-2 tw:py-1">Highest</span>
                        </label>
                        <label
                            className="tw:flex tw:items-center tw:space-x-2 tw:cursor-pointer tw:border tw:px-2 py-1 tw:border-gray-300 tw:mb-8"
                        >
                            <input
                                type="checkbox"
                                checked={sortBy === 'PRICE' && !reverse}
                                onChange={() => handlePriceFilter(false)}
                            />
                            <span className="tw:cursor-pointer tw:px-2 tw:py-1">Lowest</span>
                        </label>
                        
                        <button
                            className="tw:bg-gray-800 tw:text-white tw:px-3 tw:py-1 tw:w-full"
                            onClick={handleClearFilters}
                        >
                            Clear filters
                        </button>
                    </div>
                    
                </div>
            </div>,
            document.body
        )
    );
};

export default ProductFilterDrawer;
