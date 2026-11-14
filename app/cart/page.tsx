'use client';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Divider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function CartPage() {
  const { cartItems, cartCount, increaseQty, decreaseQty, removeItem } = useCart();
  const router = useRouter();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className={styles.page}>
      {/* Left: Cart Items */}
      <div className={styles.content}>
        <div className={styles.headingRow}>
  <h2 className={styles.title}>
    🛒 Ordering Number of Items ({cartCount})
  </h2>

  {cartItems.length > 0 && (
    <div className={styles.topActions}>
    <Button onClick={()=>router.push('/')} variant="contained" className={styles.addMore}>
    ADD MORE
  </Button>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        cartItems.forEach(item => removeItem(item.slug));
      }}
      className={styles.removeAll}
    >
      Remove All
    </motion.button>
    </div>
  )}
</div>

        {cartItems.length === 0 ? (
          <p>No items yet. Add some delicious snacks!</p>
        ) : (
          cartItems.map((item) => (
        <div key={item.slug} className={styles.item}>
          <img src={item.img} alt={item.title} className={styles.itemImage} />
          <div className={styles.itemDetails}>
            <h4>{item.title}</h4>
            <p>₹{item.price} each</p>
            <p>Quantity: {item.quantity}</p>
          </div>
          <div className={styles.quantityControls}>
            <Button aria-label={`Decrease ${item.title} quantity`} variant="outlined" className={styles.quantityButton} onClick={() => decreaseQty(item.slug)}>
              <RemoveIcon fontSize='small' />
            </Button>
            
            <span className={styles.quantity}>{item.quantity}</span>
            <Button aria-label={`Increase ${item.title} quantity`} variant="outlined" className={styles.quantityButton} onClick={() => increaseQty(item.slug)}>
              <AddIcon fontSize='small' />
            </Button>
          </div>
          <DeleteIcon onClick={() => removeItem(item.slug)} className={styles.delete} />
        </div>
      ))
        )}
      {cartItems.length > 0 
      && (
        <Box className={styles.summary}>
  <Typography variant="h6">🧾 Order Summary</Typography>

  <Box className={`${styles.summaryRow} ${styles.firstSummaryRow}`}>
    <Typography>Subtotal</Typography>
    <Typography>₹{subtotal}</Typography>
  </Box>

  <Box className={styles.summaryRow}>
    <Typography>Delivery</Typography>
    <Typography>₹{20}</Typography>
  </Box>

  <Divider className={styles.summaryDivider} />

  <Box className={styles.summaryRow}>
    <Typography variant="h6">Total</Typography>
    <Typography variant="h6">₹{subtotal + 20}</Typography>
  </Box>
  <Button onClick={() => router.push('/checkout')} variant="contained" className={styles.checkoutButton}>
    PROCEED TO CHECKOUT
  </Button>
</Box>

)}
      </div>
    </div>
  );
}
