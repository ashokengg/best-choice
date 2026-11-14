'use client';

import Link from 'next/link';
import { useAvailability } from '../context/AvailabilityContext';
import AvailabilityToggle from '../components/AvailabilityToggle';
import FavoriteButton from '../components/FavoriteButton';
import CartQuantityControl from '../components/CartQuantityControl';
import styles from './page.module.css';

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
    <main className={styles.main}>
      <h1 className={styles.title}>Choose Your Vada</h1>
      <div className={styles.grid}>
        {vadaTypes.map((vada) => (
          <article key={vada.slug} className={styles.card}>
            <FavoriteButton className="favorite-button--card" slug={vada.slug} title={vada.title} />
            <img
              src={vada.image}
              alt={vada.title}
              className={styles.image}
            />
            <h2>{vada.title}</h2>
            <p>{vada.description}</p>
            <AvailabilityToggle slug={vada.slug} title={vada.title} />
            <p>₹30 {isAvailable(vada.slug) ? '' : '· Not available'}</p>
            <div className={styles.actions}>
              <CartQuantityControl item={{
                slug: vada.slug,
                title: vada.title,
                price: 30,
                img: vada.image,
              }} />
              <Link href={`/${vada.slug}`} className={styles.details}>
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
