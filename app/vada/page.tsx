'use client';

import Link from 'next/link';
import { useAvailability } from '../context/AvailabilityContext';
import AvailabilityToggle from '../components/AvailabilityToggle';
import { useCart } from '../context/CartContext';

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
  const { addToCart } = useCart();

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 24, color: 'white' }}>
      <h1 style={{ textAlign: 'center' }}>Choose Your Vada</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        {vadaTypes.map((vada) => (
          <article
            key={vada.slug}
            style={{ padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.12)' }}
          >
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
              <button
                type="button"
                disabled={!isAvailable(vada.slug)}
                onClick={() => {
                  if (isAvailable(vada.slug)) {
                    addToCart({
                      slug: vada.slug,
                      title: vada.title,
                      price: 30,
                      img: vada.image,
                    });
                  }
                }}
                style={{
                  background: isAvailable(vada.slug) ? 'yellow' : '#777',
                  color: isAvailable(vada.slug) ? 'black' : 'white',
                  border: 0,
                  borderRadius: 10,
                  padding: '9px 14px',
                  cursor: isAvailable(vada.slug) ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                }}
              >
                {isAvailable(vada.slug) ? 'Add to Cart' : 'Not Available'}
              </button>
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
