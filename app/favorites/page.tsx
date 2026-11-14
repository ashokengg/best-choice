'use client';

import Image from 'next/image';
import Link from 'next/link';
import FavoriteButton from '../components/FavoriteButton';
import { useFavorites } from '../context/FavoritesContext';
import { useAvailability } from '../context/AvailabilityContext';
import { MENU_PRODUCTS } from '../config/products';
import CartQuantityControl from '../components/CartQuantityControl';
import { TEXT } from '../constants';

export default function FavoritesPage() {
  const { favoriteSlugs } = useFavorites();
  const { isAvailable } = useAvailability();
  const favoriteProducts = MENU_PRODUCTS.filter((product) => favoriteSlugs.includes(product.slug));

  return (
    <main className="favorites-page">
      <h1>{TEXT.favorites.heading}</h1>
      {favoriteProducts.length === 0 ? (
        <p className="favorites-empty">
          {TEXT.favorites.empty}
        </p>
      ) : (
        <div className="favorites-grid">
          {favoriteProducts.map((item) => {
            const available = isAvailable(item.slug);
            return (
              <article className="favorite-product-card" key={item.slug}>
                <FavoriteButton className="favorite-button--card" slug={item.slug} title={item.title} />
                <Image alt={item.title} height={100} src={item.img} width={140} />
                <h2>{item.title}</h2>
                <p>{item.tagline}</p>
                <span className={available ? 'favorite-availability' : 'favorite-availability unavailable'}>
                  {available ? TEXT.favorites.available : TEXT.favorites.notAvailable}
                </span>
                <div className="favorite-product-actions">
                  <strong>{TEXT.money.symbol}{item.price}</strong>
                  <CartQuantityControl item={item} />
                  <Link href={`/${item.slug}`}>{TEXT.common.details}</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
