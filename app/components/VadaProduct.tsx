'use client';

import Link from 'next/link';
import AvailabilityToggle from './AvailabilityToggle';
import FavoriteButton from './FavoriteButton';
import CartQuantityControl from './CartQuantityControl';
import type { Product } from '../config/products';
import { TEXT } from '../constants';
import styles from './VadaProduct.module.css';

export default function VadaProduct({ product }: { product: Product }) {
  return (
    <main className={styles.main}>
      <FavoriteButton className="favorite-button--card" slug={product.slug} title={product.title} />
      <img
        src={product.img}
        alt={product.title}
        className={styles.image}
      />
      <h1>{product.title}</h1>
      <AvailabilityToggle slug={product.slug} title={product.title} />
      <p>{product.detailDescription ?? product.description ?? product.tagline}</p>
      {product.details && (
        <ul>
          {product.details.map((detail) => <li key={detail}>{detail}</li>)}
        </ul>
      )}
      <p className={styles.price}>{TEXT.money.symbol}{product.price}</p>
      <CartQuantityControl item={product} />
      {' '}
      <Link href="/vada" className={styles.otherVada}>{TEXT.product.otherVadaTypes}</Link>
    </main>
  );
}
