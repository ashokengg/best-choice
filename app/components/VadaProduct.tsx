'use client';

import Link from 'next/link';
import AvailabilityToggle from './AvailabilityToggle';
import FavoriteButton from './FavoriteButton';
import CartQuantityControl from './CartQuantityControl';

type VadaProductProps = {
  slug: 'medu-vada' | 'masala-vada';
  title: string;
  image: string;
  description: string;
  details: string[];
};

export default function VadaProduct({ slug, title, image, description, details }: VadaProductProps) {
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
        position: 'relative',
      }}
    >
      <FavoriteButton className="favorite-button--card" slug={slug} title={title} />
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
      <CartQuantityControl item={{ slug, title, price: 30, img: image }} />
      {' '}
      <Link href="/vada" style={{ color: '#ffe05c', marginLeft: 12 }}>Other vada types</Link>
    </main>
  );
}
