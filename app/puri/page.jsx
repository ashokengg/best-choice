'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAvailability } from '../context/AvailabilityContext';
import AvailabilityToggle from '../components/AvailabilityToggle';
import styles from '../productDetail.module.css';

export default function Card() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAvailable } = useAvailability();
   const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 }
  }
};
const card = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { y: -4, scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }
};
  return (
    <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className={styles.container}
            >
            <motion.div
                      variants={card}
                      whileHover="hover"
                      className={`description ${styles.card}`}
                    >
          <img src="/images/puri.svg" alt="Puri" className={styles.image} />
          <h3 className={styles.title}>PURI</h3>
          <AvailabilityToggle slug="puri" title="Puri" />
          <p className={styles.description}>
              Puri is a traditional Indian deep‑fried bread made from unleavened wheat flour dough, rolled into small discs and fried until it puffs up.
          </p>
          <ul className={styles.details}>
              <li>Preparation: The dough is made from whole wheat flour, water, and a pinch of salt. It’s rolled into small circles and deep-fried in hot oil until it puffs up and turns golden brown.</li>
              <li>A staple breakfast or festive dish in Indian cuisine, puri is served hot and pairs with curries, vegetables, or sweets.</li>
              <li>Symbol of celebration and hospitality, puri often appears at weddings, festivals, and family gatherings.</li>
              <li>Light, airy, and golden brown, with a crisp exterior and soft interior.</li>
              <li>Serving Tip: Enjoy hot, straight from the pan for maximum fluffiness.Symbol of warmth and hospitality in Indian households.</li>
          </ul>
    
      <div className={styles.actions}>
       <button 
        onClick={()=> router.push('/')}
        className={styles.backButton}>
            Back
        </button>
        <button 
        disabled={!isAvailable('puri')}
        onClick={() => {
          if (isAvailable('puri')) {
            addToCart({ slug: 'puri', title: 'Puri', price: 60, img: '/images/puri.svg' });
          }
        }}
        className={styles.addButton}>
            {isAvailable('puri') ? 'Add To Cart' : 'Not Available'}
        </button>
      </div>
    </motion.div>
    </motion.div>
  );
}
