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
        <img src="/images/bonda.svg" alt="Bonda" className={styles.image} />
        <h3 className={styles.title}>BONDA</h3>
        <AvailabilityToggle slug="bonda" title="Bonda" />
       <p className={styles.description}>
        Bonda is a deep-fried South Indian snack, usually round in shape, with a crisp golden exterior and a soft, flavorful filling inside.
      </p>
      <ul className={styles.details}>
        <li>Origin & History: Bonda has roots in South India, with references dating back to the 12th century in the Sanskrit text Manasollasa.It has since evolved into many regional forms</li>
        <li>Ingredients: The classic Aloo Bonda is made with a spiced mashed potato filling, dipped in gram flour batter, and deep-fried until crisp.Other variations use sweet potato, tapioca, paneer, peas, or even pineapple</li>
        <li>Serving Style: Typically served hot with coconut chutney, tomato chutney, or sambar. In Karnataka and Andhra Pradesh, it’s a favorite tea-time snack.</li>
        <li>Texture & Flavor: Crispy outside, soft inside, with a balance of spice and comfort.</li>
      </ul>
      <div className={styles.actions}>
       <button 
        onClick={()=> router.push('/')}
        className={styles.backButton}>
            Back
        </button>
        <button 
        disabled={!isAvailable('bonda')}
        onClick={() => {
          if (isAvailable('bonda')) {
            addToCart({ slug: 'bonda', title: 'Bonda', price: 40, img: '/images/bonda.svg'});
          }
        }}
        className={styles.addButton}>
            {isAvailable('bonda') ? 'Add To Cart' : 'Not Available'}
        </button>
      </div>
      </motion.div>
    </motion.div>
  );
}
