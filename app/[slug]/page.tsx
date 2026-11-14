import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PRODUCTS_BY_SLUG } from '../config/products';
import AvailabilityToggle from '../components/AvailabilityToggle';
import CartQuantityControl from '../components/CartQuantityControl';
import FavoriteButton from '../components/FavoriteButton';
import styles from './page.module.css';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS_BY_SLUG[slug];
  if (!product) notFound();

  return (
    <main className={styles.main}>
      <FavoriteButton className="favorite-button--card" slug={product.slug} title={product.title} />
      <Image alt={product.title} className={styles.image} height={360} src={product.img} width={520} />
      <h1>{product.title}</h1>
      <div className={styles.availability}>
        <AvailabilityToggle slug={product.slug} title={product.title} />
      </div>
      <p>{product.tagline}</p>
      <p className={styles.price}>₹{product.price}</p>
      <CartQuantityControl item={product} />
      <Link className={styles.backLink} href="/">Back to menu</Link>
    </main>
  );
}
