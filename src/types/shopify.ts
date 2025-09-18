export interface Product {
    id: string;
    title: string;
    handle: string;
    vendor: string;
    images: {
        edges: { node: { url: string; altText?: string | null } }[];
    };
    variants: {
        edges: {
            node: {
                priceV2: {
                    amount: string;
                    currencyCode: string;
                };
            };
        }[];
    };
}

export interface ProductResponseEdge {
    cursor: string;
    node: Product;
}

export interface ProductsResponse {
    products: {
        edges: ProductResponseEdge[];
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
        };
    };
    localization: {
        availableCountries: CurrencySymbolObject[]
    }
}

export type SortBy = "PRICE" | undefined;

export interface ProductImage {
    url: string;
    altText: string;
  }
  
export interface ProductCardProps {
    title: string;
    price: string;
    handle: string;
    images: ProductImage[];
}

export interface CurrencySymbolObject {
    currency: {
        isoCode: string
        symbol: string
    }
}
export type Filter = {
    filterName: string,
    graphQLId: string,
    state: Record<string, boolean>,
}
export type Filters = Record<string, Filter>;

export type FiltersAction =
 { type: "TOGGLE_FILTER" | "CLEAR_FILTER"; payload?: { filterName: string, key: string } | undefined }