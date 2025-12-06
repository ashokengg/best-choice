'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Card() {
  const router = useRouter();
  const { addToCart } = useCart();
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
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            padding: '20px',
            width: "800px",
            height: "650px",
            margin: "auto",
          }}
        >
        <motion.div
                  variants={card}
                  whileHover="hover"
                  className="description"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '14px',
                    padding: '12px',
                    color: 'whitesmoke',
                    backdropFilter: 'blur(80px)',
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center'
                  }}
                >
        <img src="https://img.freepik.com/premium-photo/crispy-green-chilli-pakora-mirchi-bajji-served-with-tomato-ketchup-moody-background-its-popular-tea-time-snack-from-india-especially-monsoon-selective-focus_466689-66550.jpg" alt="Bajji" style={{ width: "50%",height:'250px',borderRadius: "8px" }} />
        <h3 style={{background:'purple',borderRadius:'30px',width:'fit-content',margin:'20px',padding:'5px 20px',color:'whitesmoke'}}>BAJJI</h3>
       <p style={{fontWeight:'bold'}}>
        Bajji is a popular South Indian fritter made by dipping sliced vegetables in a spiced gram flour batter and deep-frying until golden and crispy.
      </p>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px",fontSize:'14PX',marginTop:'10px' }}>
        <li>It’s a beloved street food and tea-time snack, often served hot with chutneys or ketchup.</li>
        <li>Bajji is typically made with onions, potatoes, raw bananas, eggplant, or green chilies.</li>
        <li>The vegetables are sliced, dipped in a batter of gram flour (besan), rice flour, chili powder, turmeric, and salt.</li>
        <li>They are fried until crisp outside and soft inside, giving a perfect balance of crunch and flavor.</li>
        <li>Bajji pairs wonderfully with coconut chutney, mint chutney, or simply a cup of hot chai.</li>
        <li>Regional Variations: Bajji is known by different names across India — onion bhaji in Maharashtra, bhajia in Gujarat, and pakora in North India. Despite the variations, the essence remains the same: crispy fritters made from gram flour batter</li>
      </ul>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'100px'}}>
        <button 
        onClick={()=> router.push('/')}
        style={{
            position: "fixed",
            bottom: "10px",
            backgroundColor: "whitesmoke",
            border: "none",
            padding: "4px 10px",
            borderRadius: "10px",
            cursor: "pointer",
            color: "black",
            marginRight: "200px",
            fontWeight: "bold"
        }}>
            Back
        </button>
        <button 
        onClick={() => addToCart({ slug: 'bajji', title: 'Bajji', price: '₹35' , img: 'https://img.freepik.com/premium-photo/crispy-green-chilli-pakora-mirchi-bajji-served-with-tomato-ketchup-moody-background-its-popular-tea-time-snack-from-india-especially-monsoon-selective-focus_466689-66550.jpg'})}
        style={{
            position: "fixed",
            bottom: "10px",
            backgroundColor: "yellow",
            border: "none",
            padding: "4px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            color: "black",
            fontWeight: "bold",
        }}>
            Add To Cart
        </button>
      </div>
      <div>
        
      </div>
      </motion.div>
    </motion.div>
  );
}
