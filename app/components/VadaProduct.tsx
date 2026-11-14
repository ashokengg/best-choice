'use client';

import Link from 'next/link';
import AvailabilityToggle from './AvailabilityToggle';
import FavoriteButton from './FavoriteButton';
import CartQuantityControl from './CartQuantityControl';
import styles from './VadaProduct.module.css';

type VadaProductProps = {
  slug: 'medu-vada' | 'masala-vada';
  title: string;
  image: string;
  description: string;
  details: string[];
};

export default function VadaProduct({ slug, title, image, description, details }: VadaProductProps) {
  return (
    <main className={styles.main}>
      <FavoriteButton className="favorite-button--card" slug={slug} title={title} />
      <img
        src={image}
        alt={title}
        className={styles.image}
      />
      <h1>{title}</h1>
      <AvailabilityToggle slug={slug} title={title} />
      <p>{description}</p>
      <ul>
        {details.map((detail) => <li key={detail}>{detail}</li>)}
      </ul>
      <p className={styles.price}>₹30</p>
      <CartQuantityControl item={{ slug, title, price: 30, img: image }} />
      {' '}
      <Link href="/vada" className={styles.otherVada}>Other vada types</Link>
    </main>
  );
}
