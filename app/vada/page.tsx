'use client';

import Link from 'next/link';
import { useAvailability } from '../context/AvailabilityContext';
import AvailabilityToggle from '../components/AvailabilityToggle';
import FavoriteButton from '../components/FavoriteButton';
import CartQuantityControl from '../components/CartQuantityControl';
import { VADA_PRODUCTS } from '../config/products';
import { TEXT } from '../constants';
import styles from './page.module.css';

export default function VadaPage() {
  const { isAvailable } = useAvailability();
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{TEXT.product.chooseVada}</h1>
      <div className={styles.grid}>
        {VADA_PRODUCTS.map((vada) => (
          <article key={vada.slug} className={styles.card}>
            <FavoriteButton className="favorite-button--card" slug={vada.slug} title={vada.title} />
            <img
              src={vada.img}
              alt={vada.title}
              className={styles.image}
            />
            <h2>{vada.title}</h2>
            <p>{vada.description ?? vada.tagline}</p>
            <AvailabilityToggle slug={vada.slug} title={vada.title} />
            <p>{TEXT.money.symbol}{vada.price} {isAvailable(vada.slug) ? '' : TEXT.product.notAvailableSuffix}</p>
            <div className={styles.actions}>
              <CartQuantityControl item={vada} />
              <Link href={`/${vada.slug}`} className={styles.details}>
                {TEXT.product.viewDetails}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
