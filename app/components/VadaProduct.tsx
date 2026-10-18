'use client';

import Link from 'next/link';
import AvailabilityToggle from './AvailabilityToggle';
import { useAvailability } from '../context/AvailabilityContext';
import { useCart } from '../context/CartContext';

type VadaProductProps = {
  slug: 'medu-vada' | 'masala-vada';
  title: string;
  image: string;
  description: string;
  details: string[];
};

export default function VadaProduct({ slug, title, image, description, details }: VadaProductProps) {
  const { addToCart } = useCart();
  const { isAvailable } = useAvailability();
  const available = isAvailable(slug);

  return (
    <main
      style={{
        maxWidth: 800,
        margin: '40px auto',
        padding: 24,
        color: 'whitesmoke',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 14,
        backdropFilter: 'blur(20px)',
      }}
    >
      <img
        src={image}
        alt={title}
        style={{ display: 'block', width: 'min(100%, 520px)', margin: '0 auto', borderRadius: 12 }}
      />
      <h1>{title}</h1>
      <AvailabilityToggle slug={slug} title={title} />
      <p>{description}</p>
      <ul>
        {details.map((detail) => <li key={detail}>{detail}</li>)}
      </ul>
      <p style={{ fontWeight: 'bold' }}>₹30</p>
      <button
        type="button"
        disabled={!available}
        onClick={() => addToCart({ slug, title, price: 30, img: image })}
        style={{
          background: available ? 'yellow' : '#777',
          color: available ? 'black' : 'white',
          border: 0,
          borderRadius: 10,
          padding: '10px 18px',
          cursor: available ? 'pointer' : 'not-allowed',
        }}
      >
        {available ? 'Add To Cart' : 'Not Available'}
      </button>
      {' '}
      <Link href="/vada" style={{ color: '#ffe05c', marginLeft: 12 }}>Other vada types</Link>
    </main>
  );
}
