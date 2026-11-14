import ProductDetails from '../components/ProductDetails';
import { PRODUCTS_BY_SLUG } from '../config/products';

export default function MasalaVadaPage() {
  return <ProductDetails product={PRODUCTS_BY_SLUG['masala-vada']} />;
}
