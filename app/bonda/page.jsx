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
        <img src="https://img.freepik.com/premium-photo/south-indian-aloo-bonda_233263-650.jpg" alt="Bonda" style={{ width: "50%",height:'250px',borderRadius: "8px" }} />
        <h3 style={{background:'purple',borderRadius:'30px',width:'fit-content',margin:'20px',padding:'5px 20px',color:'whitesmoke'}}>BONDA</h3>
       <p style={{fontWeight:'bold'}}>
        Bonda is a deep-fried South Indian snack, usually round in shape, with a crisp golden exterior and a soft, flavorful filling inside.
      </p>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px",fontSize:'14PX',marginTop:'10px' }}>
        <li>Origin & History: Bonda has roots in South India, with references dating back to the 12th century in the Sanskrit text Manasollasa.It has since evolved into many regional forms</li>
        <li>Ingredients: The classic Aloo Bonda is made with a spiced mashed potato filling, dipped in gram flour batter, and deep-fried until crisp.Other variations use sweet potato, tapioca, paneer, peas, or even pineapple</li>
        <li>Serving Style: Typically served hot with coconut chutney, tomato chutney, or sambar. In Karnataka and Andhra Pradesh, it’s a favorite tea-time snack.</li>
        <li>Texture & Flavor: Crispy outside, soft inside, with a balance of spice and comfort.</li>
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
        onClick={() => addToCart({ slug: 'bonda', title: 'Bonda', price: '₹40' , img: 'https://www.awesomecuisine.com/wp-content/uploads/2015/08/mangalore-bonda.jpg'})}
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
