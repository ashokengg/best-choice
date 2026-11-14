'use client';
import { MAX_CART_TOTAL, MAX_ITEM_QUANTITY, useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Divider, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from 'next/navigation';
import { TEXT } from '../constants';
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
    {TEXT.cart.heading(cartCount)}
  </h2>

  {cartItems.length > 0 && (
    <div className={styles.topActions}>
    <Button onClick={()=>router.push('/')} variant="contained" className={styles.addMore}>
    {TEXT.cart.addMore}
  </Button>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        cartItems.forEach(item => removeItem(item.slug));
      }}
      className={styles.removeAll}
    >
      {TEXT.cart.removeAll}
    </motion.button>
    </div>
  )}
</div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>{TEXT.cart.empty}</p>
            <Button
              onClick={() => router.push('/')}
              variant="contained"
              className={styles.backToHome}
            >
              {TEXT.cart.backHome}
            </Button>
          </div>
        ) : (
          cartItems.map((item) => (
        <div key={item.slug} className={styles.item}>
          <img src={item.img} alt={item.title} className={styles.itemImage} />
          <div className={styles.itemDetails}>
            <h4>{item.title}</h4>
            <p>{TEXT.cart.each(item.price)}</p>
            <p>{TEXT.cart.quantity(item.quantity)}</p>
          </div>
          <div className={styles.quantityControls}>
            <Button aria-label={TEXT.quantity.decrease(item.title)} variant="outlined" className={styles.quantityButton} onClick={() => decreaseQty(item.slug)}>
              <RemoveIcon fontSize='small' />
            </Button>
            
            <span className={styles.quantity}>{item.quantity}</span>
            {(() => {
              const otherItemsTotal = cartItems.reduce(
                (total, cartItem) =>
                  total + (cartItem.slug === item.slug ? 0 : cartItem.price * cartItem.quantity),
                0
              );
              const maxQuantity = Math.min(
                MAX_ITEM_QUANTITY,
                item.price > 0
                  ? Math.floor((MAX_CART_TOTAL - otherItemsTotal) / item.price)
                  : MAX_ITEM_QUANTITY
              );
              const limitReached = item.quantity >= maxQuantity;

              return (
                <Tooltip
                  arrow
                  title={
                    limitReached
                      ? item.quantity >= MAX_ITEM_QUANTITY
                        ? TEXT.quantity.maximumPerItem(MAX_ITEM_QUANTITY)
                          : TEXT.quantity.cartTotalLimit
                      : ''
                  }
                >
                  <span>
                    <Button
                      aria-label={TEXT.cart.increase(item.title)}
                      variant="outlined"
                      className={styles.quantityButton}
                      disabled={limitReached}
                      onClick={() => increaseQty(item.slug)}
                    >
                      <AddIcon fontSize='small' />
                    </Button>
                  </span>
                </Tooltip>
              );
            })()}
          </div>
          <DeleteIcon onClick={() => removeItem(item.slug)} className={styles.delete} />
        </div>
      ))
        )}
      {cartItems.length > 0 
      && (
        <Box className={styles.summary}>
  <Typography variant="h6">{TEXT.cart.orderSummary}</Typography>

  <Box className={`${styles.summaryRow} ${styles.firstSummaryRow}`}>
    <Typography>{TEXT.cart.subtotal}</Typography>
    <Typography>{TEXT.money.symbol}{subtotal}</Typography>
  </Box>

  <Box className={styles.summaryRow}>
    <Typography>{TEXT.cart.delivery}</Typography>
    <Typography>{TEXT.money.symbol}{20}</Typography>
  </Box>

  <Divider className={styles.summaryDivider} />

  <Box className={styles.summaryRow}>
    <Typography variant="h6">{TEXT.cart.total}</Typography>
    <Typography variant="h6">{TEXT.money.symbol}{subtotal + 20}</Typography>
  </Box>
  <Button onClick={() => router.push('/checkout')} variant="contained" className={styles.checkoutButton}>
    {TEXT.cart.checkout}
  </Button>
</Box>

)}
      </div>
    </div>
  );
}
