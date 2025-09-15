export const SHOPIFY_DOMAIN =
  import.meta.env.VITE_SHOPIFY_DOMAIN;

export const STOREFRONT_API_TOKEN =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

const STOREFRONT_VERSION='2025-07';
export const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/${STOREFRONT_VERSION}/graphql.json`;