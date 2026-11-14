'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAvailability } from '../context/AvailabilityContext';
import { useCart } from '../context/CartContext';

type CartItemInput = {
  slug: string;
  title: string;
  price: number;
  img?: string;
};

export default function CartQuantityControl({ item }: { item: CartItemInput }) {
  const { cartItems, addToCart, increaseQty, decreaseQty, removeItem } = useCart();
  const { isAvailable } = useAvailability();
  const quantity = cartItems.find((cartItem) => cartItem.slug === item.slug)?.quantity ?? 0;
  const available = isAvailable(item.slug);

  const increase = () => {
    if (!available) return;
    if (quantity === 0) {
      addToCart(item);
      return;
    }
    increaseQty(item.slug);
  };

  const decrease = () => {
    if (quantity === 1) {
      removeItem(item.slug);
      return;
    }
    if (quantity > 1) decreaseQty(item.slug);
  };

  return (
    <div aria-label={`${item.title} quantity`} className={`cart-quantity-control${quantity > 0 ? ' is-expanded' : ''}`}>
      {quantity > 0 && (
        <button
          aria-label={`Decrease ${item.title} quantity`}
          className="cart-quantity-button"
          onClick={decrease}
          type="button"
        >
          <RemoveIcon fontSize="small" />
        </button>
      )}
      {quantity > 0 && <span aria-live="polite" className="cart-quantity-value">{quantity}</span>}
      <button
        aria-label={available ? `Increase ${item.title} quantity` : `${item.title} is not available`}
        className="cart-quantity-button"
        disabled={!available}
        onClick={increase}
        type="button"
      >
        <AddIcon fontSize="small" />
      </button>
    </div>
  );
}
