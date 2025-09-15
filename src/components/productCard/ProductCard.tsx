import type { Product, CurrencySymbolObject } from "../../types/shopify";
import FadeInImage from "./FadeInImage";


const ProductCard = ({ product, availableCurrencySymbols }: { product: Product, availableCurrencySymbols: CurrencySymbolObject[] }) => {
    const title = product.title;
    const vendor = product.vendor;
    const mainImage = product.images.edges[0].node;
    const secondaryImage = product.images.edges[1]?.node;
    const handle = product.handle;
    const currencyCode = product.variants.edges[0].node.priceV2.currencyCode;
    const price = product.variants.edges[0].node.priceV2.amount;

    const currencySymbol = availableCurrencySymbols.find(currencyObject => currencyObject.currency.isoCode === currencyCode)?.currency.symbol + '. ' || currencyCode;

    return (
        <a href={`/products/${handle}`} className="tw:group tw:mb-4">
            <div className="tw:relative tw:aspect-[2/3] tw:overflow-hidden tw:mb-1">
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
                    {vendor}
                </h3>
                <h3 className="tw:text-sm tw:text-stone-800 tw:mb-1">{title}</h3>
                <p className="tw:text-sm tw:text-stone-700">
                    {currencySymbol}
                    {price}
                </p>
            </div>
        </a>
    );
};

export default ProductCard;
