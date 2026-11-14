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
        <img src="/images/bajji.svg" alt="Bajji" className={styles.image} />
        <h3 className={styles.title}>BAJJI</h3>
        <AvailabilityToggle slug="bajji" title="Bajji" />
       <p className={styles.description}>
        Bajji is a popular South Indian fritter made by dipping sliced vegetables in a spiced gram flour batter and deep-frying until golden and crispy.
      </p>
      <ul className={styles.details}>
        <li>It’s a beloved street food and tea-time snack, often served hot with chutneys or ketchup.</li>
        <li>Bajji is typically made with onions, potatoes, raw bananas, eggplant, or green chilies.</li>
        <li>The vegetables are sliced, dipped in a batter of gram flour (besan), rice flour, chili powder, turmeric, and salt.</li>
        <li>They are fried until crisp outside and soft inside, giving a perfect balance of crunch and flavor.</li>
        <li>Bajji pairs wonderfully with coconut chutney, mint chutney, or simply a cup of hot chai.</li>
        <li>Regional Variations: Bajji is known by different names across India — onion bhaji in Maharashtra, bhajia in Gujarat, and pakora in North India. Despite the variations, the essence remains the same: crispy fritters made from gram flour batter</li>
      </ul>
      <div className={`${styles.actions} ${styles.actionsWithGap}`}>
        <button 
        onClick={()=> router.push('/')}
        className={styles.backButton}>
            Back
        </button>
        <button 
        disabled={!isAvailable('bajji')}
        onClick={() => {
          if (isAvailable('bajji')) {
            addToCart({ slug: 'bajji', title: 'Bajji', price: 35, img: '/images/bajji.svg'});
          }
        }}
        className={styles.addButton}>
            {isAvailable('bajji') ? 'Add To Cart' : 'Not Available'}
        </button>
      </div>
      <div>
        
      </div>
      </motion.div>
    </motion.div>
  );
}
