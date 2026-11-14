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
          <img src="/images/dosa.svg" alt="Dosa" className={styles.image} />
          <h3 className={styles.title}>DOSA</h3>
          <AvailabilityToggle slug="dosa" title="Dosa" />
          <p className={styles.description}>
              Dosa is a thin, crispy South Indian crepe made from a fermented batter of rice and black gram (urad dal), enjoyed hot with chutneys and sambar.
          </p>
          <ul className={styles.details}>
              <li>Origin & Popularity: Dosa originated in South India and has been a staple for centuries. Today, it’s enjoyed across India and internationally as a breakfast, snack, or even dinner option</li>
              <li>Ingredients: The batter is made from rice and urad dal, soaked, ground, and fermented overnight. This fermentation gives dosa its slight tang and airy crispness</li>
              <li>Texture & Flavor: Dosa is thin, golden-brown, and crispy on the outside, with a soft center. Its flavor is mildly savory with a hint of sourness from fermentation</li>
              <li>Serving Style: Traditionally served hot with coconut chutney, tomato chutney, and sambar. Variations include masala dosa (stuffed with spiced potato filling), rava dosa (made with semolina), paneer dosa, and many more</li>
          </ul>
    
      <div className={styles.actions}>
        <button 
        onClick={()=> router.push('/')}
        className={styles.backButton}>
            Back
        </button>
        <button 
        disabled={!isAvailable('dosa')}
        onClick={() => {
          if (isAvailable('dosa')) {
            addToCart({ slug: 'dosa', title: 'Dosa', price: 60, img: '/images/dosa.svg' });
          }
        }}
        className={styles.addButton}>
            {isAvailable('dosa') ? 'Add To Cart' : 'Not Available'}
        </button>
      </div>
    </motion.div>
    </motion.div>
  );
}
