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
          <img src="https://cdn.cdnparenting.com/articles/2020/02/26144721/PURI-BHAJI-RECIPE.jpg" alt="dosa" style={{ width: "50%",height:'250px',borderRadius: "8px" }} />
          <h3 style={{background:'purple',borderRadius:'30px',width:'fit-content',margin:'20px',padding:'5px 20px',color:'whitesmoke'}}>PURI</h3>
          <p style={{fontWeight:'bold'}}>
              Puri is a traditional Indian deep‑fried bread made from unleavened wheat flour dough, rolled into small discs and fried until it puffs up.
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px",fontSize:'14PX',marginTop:'10px' }}>
              <li>Preparation: The dough is made from whole wheat flour, water, and a pinch of salt. It’s rolled into small circles and deep-fried in hot oil until it puffs up and turns golden brown.</li>
              <li>A staple breakfast or festive dish in Indian cuisine, puri is served hot and pairs with curries, vegetables, or sweets.</li>
              <li>Symbol of celebration and hospitality, puri often appears at weddings, festivals, and family gatherings.</li>
              <li>Light, airy, and golden brown, with a crisp exterior and soft interior.</li>
              <li>Serving Tip: Enjoy hot, straight from the pan for maximum fluffiness.Symbol of warmth and hospitality in Indian households.</li>
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
        onClick={() => addToCart({ slug: 'puri', title: 'Puri', price: '₹35' , img: 'https://cdn.cdnparenting.com/articles/2020/02/26144721/PURI-BHAJI-RECIPE.jpg'})}
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
