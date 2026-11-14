import ProductDetails from '../components/ProductDetails';
import { PRODUCTS_BY_SLUG } from '../config/products';

export default function BajjiPage() {
  return <ProductDetails product={PRODUCTS_BY_SLUG.bajji} />;
}
