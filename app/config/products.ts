import productData from './products.json';

export type Product = {
  slug: string;
  title: string;
  tagline: string;
  description?: string;
  detailDescription?: string;
  details?: string[];
  price: number;
  img: string;
};

export const PRODUCTS: Product[] = productData;

export const PRODUCTS_BY_SLUG: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((product) => [product.slug, product]),
);

export const MENU_PRODUCTS = PRODUCTS.filter((product) => product.slug !== 'vada');

export const VADA_PRODUCTS = PRODUCTS.filter(
  (product) => product.slug === 'medu-vada' || product.slug === 'masala-vada',
);
