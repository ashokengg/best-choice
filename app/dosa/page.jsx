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
                        backdropFilter: 'blur(80px)',display:'flex',flexDirection:'column',alignItems:'center',
                      }}
                    >
          <img src="https://wallpaperaccess.com/full/6340449.jpg" alt="dosa" style={{ width: "50%",height:'250px',borderRadius: "8px" }} />
          <h3 style={{background:'purple',borderRadius:'30px',width:'fit-content',margin:'20px',padding:'5px 20px',color:'whitesmoke'}}>DOSA</h3>
          <p style={{fontWeight:'bold'}}>
              Dosa is a thin, crispy South Indian crepe made from a fermented batter of rice and black gram (urad dal), enjoyed hot with chutneys and sambar.
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px",fontSize:'14PX',marginTop:'10px' }}>
              <li>Origin & Popularity: Dosa originated in South India and has been a staple for centuries. Today, it’s enjoyed across India and internationally as a breakfast, snack, or even dinner option</li>
              <li>Ingredients: The batter is made from rice and urad dal, soaked, ground, and fermented overnight. This fermentation gives dosa its slight tang and airy crispness</li>
              <li>Texture & Flavor: Dosa is thin, golden-brown, and crispy on the outside, with a soft center. Its flavor is mildly savory with a hint of sourness from fermentation</li>
              <li>Serving Style: Traditionally served hot with coconut chutney, tomato chutney, and sambar. Variations include masala dosa (stuffed with spiced potato filling), rava dosa (made with semolina), paneer dosa, and many more</li>
          </ul>
    
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
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
        onClick={() => addToCart({ slug: 'dosa', title: 'Dosa', price: '₹60' , img: 'https://wallpaperaccess.com/full/6340449.jpg'})}
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
    </motion.div>
    </motion.div>
  );
}
