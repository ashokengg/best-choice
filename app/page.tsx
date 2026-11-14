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
import { TEXT } from './constants';
import styles from './page.module.css';

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
      className={styles.grid}
    >
      {filteredItems.map((item) => (
        <motion.div
          key={item.slug}
          variants={card}
          whileHover="hover"
          className={styles.card}
        >
          <FavoriteButton className="favorite-button--card" slug={item.slug} title={item.title} />
          <img src={item.img} alt={item.title} className={styles.image} />
          <h4 className={styles.title}>{item.title}</h4>
          <p className={styles.tagline}>{item.tagline}</p>
          <AvailabilityToggle slug={item.slug} title={item.title} />

          <div className={styles.actions}>
            <span className={styles.price}>{TEXT.money.symbol}{item.price}</span>
              <div className={styles.quantityControl}>
                <CartQuantityControl item={item} />
              </div>
              <Link aria-label={TEXT.home.productInfo(item.title)} className={styles.infoLink} href={`/${item.slug}`}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className={styles.infoButton}
              >
              <ArrowForward fontSize="small" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      ))}
       <FloatingCheckout /> 
    </motion.div>
    
  );
}
