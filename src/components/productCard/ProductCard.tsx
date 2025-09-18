import type { Product, CurrencySymbolObject } from "../../types/shopify";
import FadeInImage from "./FadeInImage";


const ProductCard = ({ product, availableCurrencySymbols }: { product: Product, availableCurrencySymbols: CurrencySymbolObject[] }) => {
    const title = product.title;
    const vendor = product.vendor;
    const mainImage = product.images.edges[0]?.node;
    const secondaryImage = product.images.edges[1]?.node;
    const handle = product.handle;
    const currencyCode = product.variants.edges[0].node.priceV2.currencyCode;
    const price = product.variants.edges[0].node.priceV2.amount;

    const currencySymbol = product.handle === "dummy-handle" ? '' : availableCurrencySymbols.find(currencyObject => currencyObject.currency.isoCode === currencyCode)?.currency.symbol + '. ' || currencyCode;

    return (
        <a href={`/products/${handle}`} className="tw:group tw:mb-4">
            <div className="tw:relative tw:aspect-[2/3] tw:overflow-hidden tw:mb-1">
                <div className="tw:absolute tw:inset-0 tw:bg-stone-300 tw:animate-pulse tw:-z-1" />
                {mainImage && (
                    <FadeInImage
                        src={`${mainImage.url}&width=400`}
                        srcSet={`
                            ${mainImage.url}&width=200 200w,
                            ${mainImage.url}&width=400 400w,
                            ${mainImage.url}&width=800 800w
                        `}
                        sizes="(max-width: 640px) 200px,
                            (max-width: 1024px) 400px,
                            800px"
                        alt={mainImage.altText || title}
                        className="tw:w-full tw:h-full tw:object-cover tw:block"
                        loading="lazy"
                    />
                )}

                {secondaryImage && (
                    <img
                        src={`${secondaryImage.url}&width=400`}
                        srcSet={`
                            ${secondaryImage.url}&width=200 200w,
                            ${secondaryImage.url}&width=400 400w,
                            ${secondaryImage.url}&width=800 800w
                        `}
                        sizes="(max-width: 640px) 200px,
                            (max-width: 1024px) 400px,
                            800px"
                        alt={secondaryImage.altText || title}
                        className="tw:absolute tw:inset-0 tw:w-full tw:h-full tw:object-cover tw:opacity-0 tw:transition-opacity tw:duration-700 tw:group-hover:opacity-100"
                        loading="lazy"
                    />
                )}
            </div>

            <div className="tw:p-2 tw:text-center">
                <h3 className="tw:text-sm tw:text-stone-800 tw:uppercase tw:font-semibold">
                    {vendor || <div className="tw:h-3 tw:w-1/3 tw:mx-auto tw:bg-stone-300 tw:rounded tw:mb-1" />}
                </h3>
                <h3 className="tw:text-sm tw:text-stone-800 tw:mb-1">{title || <div className="tw:h-4 tw:w-2/3 tw:mx-auto tw:bg-stone-300 tw:rounded" />}</h3>
                <p className="tw:text-sm tw:text-stone-700">
                    {!currencySymbol && !price ? <div className="tw:h-3 tw:w-1/4 tw:mx-auto tw:bg-stone-300 tw:rounded" /> : ''}
                    {currencySymbol}
                    {price}
                </p>
            </div>
        </a>
    );
};

export default ProductCard;
