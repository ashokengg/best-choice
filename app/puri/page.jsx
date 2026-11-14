import ProductDetails from '../components/ProductDetails';
import { PRODUCTS_BY_SLUG } from '../config/products';

export default function PuriPage() {
  return <ProductDetails product={PRODUCTS_BY_SLUG.puri} />;
}
