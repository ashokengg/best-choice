import ProductDetails from '../components/ProductDetails';
import { PRODUCTS_BY_SLUG } from '../config/products';

export default function BondaPage() {
  return <ProductDetails product={PRODUCTS_BY_SLUG.bonda} />;
}
