// components/SnackCards.tsx
'use client';

import { ArrowForward } from '@mui/icons-material';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useSearch } from './components/searchBar';
import FloatingCheckout from './components/floatingCheckout';
import AvailabilityToggle from './components/AvailabilityToggle';
import { MENU_PRODUCTS } from './config/products';
import FavoriteButton from './components/FavoriteButton';
import CartQuantityControl from './components/CartQuantityControl';

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
            boxSizing: 'border-box',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <FavoriteButton className="favorite-button--card" slug={item.slug} title={item.title} />
          <img src={item.img} alt={item.title} style={{
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

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 'auto' }}>
            <span style={{ fontWeight: 600 }}>₹{item.price}</span>
              <CartQuantityControl item={item} />
              <Link aria-label={`More information about ${item.title}`} className="product-info-link" href={`/${item.slug}`}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="product-info-button"
              >
              <ArrowForward style={{ fontSize: 14 }} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      ))}
       <FloatingCheckout /> 
    </motion.div>
    
  );
}
