import { STOREFRONT_API_URL, STOREFRONT_API_TOKEN } from "../config";
import type { SortBy } from "../types/shopify";

interface Variables {
    first?: number;
    after?: string | null;
    productType?: string;
    vendor?: string;
    sortKey?: SortBy;
    reverse?: boolean;
}

export const graphQLProductRequest = async <T>(
    query: string,
    variables: Variables,
    signal?: AbortSignal
): Promise<T> => {
    const { productType, vendor } = variables;
    const filters: { productType?: string; productVendor?: string }[] = [];

    if (productType) {
        filters.push({ productType });
    }

    if (vendor) {
        filters.push({ productVendor: vendor });
    }
    
    const res = await fetch(STOREFRONT_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": STOREFRONT_API_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
        signal,
    });

    if (!res.ok) {
        throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
    }

    const { data, errors } = await res.json();

    if (errors) {
        console.error(errors);
        throw new Error("GraphQL errors occurred.");
    }

    return data;
};
