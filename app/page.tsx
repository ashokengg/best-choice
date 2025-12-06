// components/SnackCards.tsx
'use client';

import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from './context/CartContext';
import { useState } from 'react';
import { useSearch } from './components/searchBar';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import FloatingCheckout from './components/floatingCheckout';

type Snack = {
  slug: string;
  title: string;
  tagline: string;
  price: number;
  img: string;
};
const items: Snack[]= [
  { slug: 'dosa', title: 'Dosa', tagline: 'Golden crisp, airy bliss', price: 60,img:'https://www.awesomecuisine.com/wp-content/uploads/2009/06/Plain-Dosa.jpg'},
  { slug: 'bonda', title: 'Bonda', tagline: 'Golden crunch, spicy punch', price: 40,img:'https://www.awesomecuisine.com/wp-content/uploads/2015/08/mangalore-bonda.jpg' },
  { slug: 'bajji', title: 'Bajji', tagline: 'Crispy delight with every bite', price: 35,img:'https://www.shutterstock.com/image-photo/chilli-bajji-common-snack-south-600nw-142005064.jpg' },
  { slug: 'vada', title: 'Vada', tagline: 'Crispy ring of flavor', price: 45,img:'https://img.freepik.com/premium-photo/south-indian-vada-medu-vada-dal-vadai-plate-bowl-isolated-plain_466689-1576.jpg?w=1800' },
  { slug: 'puri', title: 'Puri', tagline: 'Crisp puris topped with chutneys', price: 60,img:'https://cdn.cdnparenting.com/articles/2020/02/26144721/PURI-BHAJI-RECIPE.jpg' },
  { slug: 'idli', title: 'Idli', tagline: 'Soft steamed rice cakes', price: 40, img: 'https://tse4.mm.bing.net/th/id/OIP.ia3E9RgSk5nV00Gy7woiPQHaFN?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { slug: 'upma', title: 'Upma', tagline: 'Savory semolina delight', price: 50, img: 'https://images.news18.com/tamil/uploads/2023/03/Upma.jpg' },
  { slug: 'pesarattu', title: 'Pesarattu', tagline: 'Protein-rich green gram dosa', price: 65, img: 'https://i.ytimg.com/vi/c0PQz7TF7RQ/maxresdefault.jpg' },
  { slug: 'samosa', title: 'Samosa', tagline: 'Crispy pastry with spiced filling', price: 30, img: 'https://th.bing.com/th/id/OIP.KUd0HiSj_aMV-8gKT_QqEQHaE7?w=290&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' },
  { slug: 'pakora', title: 'Pakora', tagline: 'Golden fritters with crunch', price: 35, img: 'https://img.freepik.com/premium-photo/crunchy-mixed-veg-pakoras-display_762785-245397.jpg' },
  { slug: 'bhel-puri', title: 'Bhel Puri', tagline: 'Tangy puffed rice mix', price: 45, img: 'https://st2.depositphotos.com/5653638/11749/i/450/depositphotos_117492878-stock-photo-indian-snacks-bhel-puri-served.jpg' },
  { slug: 'sev-puri', title: 'Sev Puri', tagline: 'Crisp puris with chutneys & sev', price: 55, img: 'https://img.freepik.com/premium-photo/indian-spicy-chaat-item-sev-puri_55610-361.jpg' },
  { slug: 'pav-bhaji', title: 'Pav Bhaji', tagline: 'Buttery bread with spicy mash', price: 80, img: 'https://img.freepik.com/premium-photo/cheese-pav-bhaji-recipe-is-street-food-bhajipav-recipe-with-addition-cheese_466689-86301.jpg?w=1380' },
  { slug: 'jalebi', title: 'Jalebi', tagline: 'Sweet golden spirals', price: 50, img: 'https://t4.ftcdn.net/jpg/04/38/47/49/360_F_438474990_JoG353LkW1HzqIyARt9gNJ0rxfmp0PxA.jpg' },
];

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
  hover: { y: -1, scale: 1.06, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }
};

export default function SnackCards() {
  const [open, setOpen] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);

  const handleAddToCart = (snack: Snack) => {
    setSelectedSnack(snack);
    setOpen(true); // ✅ popup opens after click
  };
  const { searchTerm } = useSearch();
   const safeSearch = searchTerm || "";

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(safeSearch.toLowerCase())
  );
  const { addToCart } = useCart();
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
            zIndex: 1,
          }}
        >
          <img src={item.img} style={{
            height: 70,
            width: '50%',
            borderRadius: 10,
            marginBottom: 10
          }} />
          <h4 style={{ margin: '0 0 6px', letterSpacing: '0.5px'}}>{item.title}</h4>
          <p style={{ margin: '0 0 10px', fontSize: 13, opacity: 0.9 }}>{item.tagline}</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600,marginRight:'10px' }}>{item.price}</span>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { addToCart({ slug: item.slug, title: item.title, price: item.price , img: item.img});handleAddToCart(item); }}
                style={{
                  background: 'yellow',
                  color: 'black',
                  border: 'none',
                  borderRadius: 10,
                  padding: '4px 6px',
                  fontSize: 11,
                  cursor: 'pointer',
                  marginRight:'10px'
                }}
              >
                Add to Cart
              </motion.button>
              <Link href={`/${item.slug}`} style={{ textDecoration: 'none' }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: 10,
                  padding: '4px 6px',
                  fontSize: 11,
                  cursor: 'pointer',
                  marginRight:'10px'
                }}
              >
                more info<ArrowForward style={{ fontSize: 14, marginLeft: 4 }} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      ))}
       <FloatingCheckout /> 
    </motion.div>
    
  );
}
