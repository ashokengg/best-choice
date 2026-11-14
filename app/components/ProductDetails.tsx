'use client';

import { useRouter } from 'next/navigation';
import AvailabilityToggle from './AvailabilityToggle';
import CartQuantityControl from './CartQuantityControl';
import FavoriteButton from './FavoriteButton';
import type { Product } from '../config/products';
import { TEXT } from '../constants';
import styles from '../productDetail.module.css';

export default function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <main className={styles.container}>
      <article className={styles.card}>
        <FavoriteButton className="favorite-button--card" slug={product.slug} title={product.title} />
        <img src={product.img} alt={product.title} className={styles.image} />
        <h1 className={styles.title}>{product.title.toUpperCase()}</h1>
        <AvailabilityToggle slug={product.slug} title={product.title} />
        <p className={styles.description}>{product.detailDescription ?? product.description ?? product.tagline}</p>
        {product.details && (
          <ul className={styles.details}>
            {product.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
        )}
        <p>{TEXT.money.symbol}{product.price}</p>
        <div className={styles.actions}>
          <button onClick={() => router.push('/')} className={styles.backButton} type="button">
            {TEXT.common.back}
          </button>
          <CartQuantityControl item={product} />
        </div>
      </article>
    </main>
  );
}
