import ProductDetails from '../components/ProductDetails';
import { PRODUCTS_BY_SLUG } from '../config/products';

export default function DosaPage() {
  return <ProductDetails product={PRODUCTS_BY_SLUG.dosa} />;
}
