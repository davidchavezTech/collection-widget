import ProductCard from "../productCard/ProductCard";
import type { Product, CurrencySymbolObject } from "../../types/shopify";
import ProductCardSkeleton from "../productCard/ProductCardSkeleton";
import { type RefObject } from "react";

interface ProductGridProps {
    products: Product[];
    availableCurrencySymbols: CurrencySymbolObject[];
    loading: boolean;
    error: boolean;
    loadingMoreProducts: boolean;
    initialllyLoadedRef: RefObject<boolean>;
}

export default function ProductGrid({
    products,
    availableCurrencySymbols,
    loading,
    error,
    loadingMoreProducts,
    initialllyLoadedRef
}: ProductGridProps) {
    
    return (
        <div className="tw:w-full">
            {
                products.length === 0 && !loading && !error && initialllyLoadedRef.current ? <p className="tw:text-center tw:w-full tw:mt-20">No results, please select a different filter</p> : ''
            }

            {error && <p className="tw:text-red-500 tw:m-4">Failed to load products.</p>}

            <div className="tw:grid tw:gap-2 tw:grid-cols-2 tw:md:grid-cols-3 tw:lg:grid-cols-4">
                
                {products.map((product) => (
                    <div key={product.id} className="tw:relative">
                        {/* Product */}
                        <div
                            className={`tw:transition-opacity tw:duration-500 ${
                                loading ? "tw:opacity-0" : "tw:opacity-100"
                            }`}
                        >
                            <ProductCard
                                product={product}
                                availableCurrencySymbols={
                                    availableCurrencySymbols
                                }
                            />
                        </div>
                    </div>
                ))}

                {/* Extra skeletons if products array is empty while loading */}
                {loadingMoreProducts &&
                    Array.from({ length: 20 }).map((_, i) => (
                        <ProductCardSkeleton key={`skeleton-${i}`} />
                    ))
                }

            </div>
        </div>
    );
}
