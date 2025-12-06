"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function FloatingCheckout() {
  const { cartItems } = useCart();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // calculate total
  const total = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) return null; // hide if cart empty

  return (
    <>
      <div className="floating-checkout" onClick={() => setOpen(true)}>
        <span>🛒 View Cart ({cartItems.length} items)</span>
        <div>
            <Button size='small'style={{marginRight:'30px', border:'1px solid',color:'white'}}onClick={()=>router.push('/cart')}>Remove</Button>
        <Button size='small'style={{marginRight:'30px', border:'1px solid',color:'white'}}onClick={()=>router.push('/cart')}>Checkout</Button>
        <span>Total: ₹{total}</span>
        </div>
      </div>
    </>
  );
}
