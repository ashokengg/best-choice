'use client';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import { div } from 'framer-motion/client';
import { Box, Button, Divider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, cartCount, increaseQty, decreaseQty, removeItem } = useCart();
  const router = useRouter();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div style={{ display: 'flex', gap: '30px', padding: '40px',marginTop: '10px', borderRadius: '16px', background: '#FFF8E1',height: 'fit-content'}}>
      {/* Left: Cart Items */}
      <div style={{ flex: 2 }}>
        <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  }}
>
  <h2 style={{ color: '#4E342E', margin: 0 }}>
    🛒 Ordering Number of Items ({cartCount})
  </h2>

  {cartItems.length > 0 && (
    <div>
    <Button onClick={()=>router.push('/')} variant="contained" sx={{ bgcolor: "#4caf50", color: "#fff",marginRight:'20px',borderRadius:'12px' }}>
    ADD MORE
  </Button>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        cartItems.forEach(item => removeItem(item.slug));
      }}
      style={{
        background: '#C62828',
        border: 'none',
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: 14,
        cursor: 'pointer',
        color: '#fff',
        fontWeight: 600,
      }}
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
        <div key={item.slug} style={{ display: 'flex', alignItems: 'center',borderBottom: '1px solid #ccc', marginBottom: 12 }}>
          <img src={item.img} style={{ height: 50, borderRadius: 8 }} />
          <div style={{ flex: 1, marginLeft: 12 }}>
            <h4>{item.title}</h4>
            <p>{item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
          <div>
            <Button variant="outlined" style={{ minWidth: '10px',height: '25px', padding: '5px' }}>
              <RemoveIcon fontSize='small' onClick={() => decreaseQty(item.slug)} />
            </Button>
            
            <span style={{ margin: '0 8px' }}>{item.quantity}</span>
            <Button variant="outlined" style={{ minWidth: '10px',height: '25px', padding: '5px' }}>
              <AddIcon fontSize='small' onClick={() => increaseQty(item.slug)} />
            </Button>
          </div>
          <DeleteIcon onClick={() => removeItem(item.slug)} style={{ cursor: 'pointer', marginLeft: 12 }} />
        </div>
      ))
        )}
      {cartItems.length > 0 
      && (
        <Box sx={{ p: 2, bgcolor: "white", color: "black", borderRadius: 4,border:'1px solid rgba(0,0,0,0.1)', marginTop: 4 }}>
  <Typography variant="h6">🧾 Order Summary</Typography>

  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
    <Typography>Subtotal</Typography>
    <Typography>₹{subtotal}</Typography>
  </Box>

  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
    <Typography>Delivery</Typography>
    <Typography>₹{20}</Typography>
  </Box>

  <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 2 }} />

  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="h6">Total</Typography>
    <Typography variant="h6">₹{subtotal + 20}</Typography>
  </Box>
  <Button variant="contained" sx={{ bgcolor: "#795548", color: "#fff",marginLeft:'1200px',mt: 5 }}>
    PROCEED TO CHECKOUT
  </Button>
</Box>

)}
      </div>
    </div>
  );
}
