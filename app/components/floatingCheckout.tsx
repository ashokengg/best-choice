"use client";
import { useCart } from "../context/CartContext";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import styles from './floatingCheckout.module.css';

export default function FloatingCheckout() {
  const { cartItems } = useCart();
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
        <span>🛒 View Cart ({cartItems.length} items)</span>
        <div>
            <Button size='small' className={styles.actionButton} onClick={()=>router.push('/cart')}>Remove</Button>
        <Button size='small' className={styles.actionButton} onClick={()=>router.push('/cart')}>Checkout</Button>
        <span>Total: ₹{total}</span>
        </div>
      </div>
    </>
  );
}
