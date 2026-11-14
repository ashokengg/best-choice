'use client';

import Link from 'next/link';
import { useAvailability } from '../context/AvailabilityContext';
import AvailabilityToggle from '../components/AvailabilityToggle';
import FavoriteButton from '../components/FavoriteButton';
import CartQuantityControl from '../components/CartQuantityControl';

const vadaTypes = [
  {
    slug: 'medu-vada',
    title: 'Medu Vada',
    description: 'A golden lentil doughnut with a crisp outside and soft center.',
    image: '/images/medu-vada.svg',
  },
  {
    slug: 'masala-vada',
    title: 'Masala Vada',
    description: 'A crunchy chana dal patty seasoned with aromatic spices.',
    image: '/images/masala-vada.svg',
  },
];

export default function VadaPage() {
  const { isAvailable } = useAvailability();
  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 24, color: 'white' }}>
      <h1 style={{ textAlign: 'center' }}>Choose Your Vada</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        {vadaTypes.map((vada) => (
          <article
            key={vada.slug}
            style={{ padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.12)', position: 'relative' }}
          >
            <FavoriteButton className="favorite-button--card" slug={vada.slug} title={vada.title} />
            <img
              src={vada.image}
              alt={vada.title}
              style={{ display: 'block', width: '100%', borderRadius: 12 }}
            />
            <h2>{vada.title}</h2>
            <p>{vada.description}</p>
            <AvailabilityToggle slug={vada.slug} title={vada.title} />
            <p>₹30 {isAvailable(vada.slug) ? '' : '· Not available'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CartQuantityControl item={{
                slug: vada.slug,
                title: vada.title,
                price: 30,
                img: vada.image,
              }} />
              <Link href={`/${vada.slug}`} style={{ color: '#ffe05c', fontWeight: 'bold' }}>
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
