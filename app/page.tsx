// components/SnackCards.tsx
'use client';

import { ArrowForward } from '@mui/icons-material';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useCart } from './context/CartContext';
import { useSearch } from './components/searchBar';
import FloatingCheckout from './components/floatingCheckout';
import { useAvailability } from './context/AvailabilityContext';
import AvailabilityToggle from './components/AvailabilityToggle';
import { MENU_PRODUCTS } from './config/products';

const items = MENU_PRODUCTS;
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  hover: { y: -1, scale: 1.06, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' },
};

export default function SnackCards() {
  const { searchTerm } = useSearch();
  const safeSearch = searchTerm || "";

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(safeSearch.toLowerCase())
  );
  const { addToCart } = useCart();
  const { isAvailable } = useAvailability();
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '16px',
        padding: '20px',
        zIndex: 1
      }}
    >
      {filteredItems.map((item) => (
        <motion.div
          key={item.slug}
          variants={card}
          whileHover="hover"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '14px',
            padding: '12px',
            color: 'white',
            backdropFilter: 'blur(10px)',
            zIndex: 1,
          }}
        >
          <img src={item.img} style={{
            height: 70,
            width: '50%',
            borderRadius: 10,
            marginBottom: 10
          }} />
          <h4 style={{ margin: '0 0 6px', letterSpacing: '0.5px'}}>{item.title}</h4>
          <p style={{ margin: '0 0 10px', fontSize: 13, opacity: 0.9 }}>{item.tagline}</p>
          <div style={{ marginBottom: 10 }}>
            <AvailabilityToggle slug={item.slug} title={item.title} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600,marginRight:'10px' }}>{item.price}</span>
              <motion.button
                whileTap={isAvailable(item.slug) ? { scale: 0.97 } : undefined}
                disabled={!isAvailable(item.slug)}
                onClick={() => {
                  if (!isAvailable(item.slug)) return;
                  addToCart({ slug: item.slug, title: item.title, price: item.price , img: item.img});
                }}
                style={{
                  background: isAvailable(item.slug) ? 'yellow' : '#777',
                  color: isAvailable(item.slug) ? 'black' : 'white',
                  border: 'none',
                  borderRadius: 10,
                  padding: '4px 6px',
                  fontSize: 11,
                  cursor: isAvailable(item.slug) ? 'pointer' : 'not-allowed',
                  marginRight:'10px'
                }}
              >
                {isAvailable(item.slug) ? 'Add to Cart' : 'Not Available'}
              </motion.button>
              <Link href={`/${item.slug}`} style={{ textDecoration: 'none' }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: 10,
                  padding: '4px 6px',
                  fontSize: 11,
                  cursor: 'pointer',
                  marginRight:'10px'
                }}
              >
                more info<ArrowForward style={{ fontSize: 14, marginLeft: 4 }} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      ))}
       <FloatingCheckout /> 
    </motion.div>
    
  );
}
