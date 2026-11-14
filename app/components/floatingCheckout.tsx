"use client";
import { useCart } from "../context/CartContext";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { TEXT } from '../constants';
import styles from './floatingCheckout.module.css';

export default function FloatingCheckout() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  // calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) return null; // hide if cart empty

  return (
    <>
      <div className="floating-checkout">
        <span>{TEXT.floatingCheckout.viewCart(cartItems.length)}</span>
        <div>
            <Button size='small' className={styles.actionButton} onClick={clearCart}>{TEXT.floatingCheckout.remove}</Button>
        <Button size='small' className={styles.actionButton} onClick={()=>router.push('/cart')}>{TEXT.floatingCheckout.checkout}</Button>
        <span>{TEXT.floatingCheckout.total(total)}</span>
        </div>
      </div>
    </>
  );
}
