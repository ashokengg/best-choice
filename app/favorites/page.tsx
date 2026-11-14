'use client';

import Image from 'next/image';
import Link from 'next/link';
import FavoriteButton from '../components/FavoriteButton';
import { useFavorites } from '../context/FavoritesContext';
import { useAvailability } from '../context/AvailabilityContext';
import { MENU_PRODUCTS } from '../config/products';
import CartQuantityControl from '../components/CartQuantityControl';

export default function FavoritesPage() {
  const { favoriteSlugs } = useFavorites();
  const { isAvailable } = useAvailability();
  const favoriteProducts = MENU_PRODUCTS.filter((product) => favoriteSlugs.includes(product.slug));

  return (
    <main className="favorites-page">
      <h1>My Favourites</h1>
      {favoriteProducts.length === 0 ? (
        <p className="favorites-empty">
          You haven’t added any favourites yet. Select the heart on any menu item to save it here.
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
                  {available ? 'Available' : 'Not Available'}
                </span>
                <div className="favorite-product-actions">
                  <strong>₹{item.price}</strong>
                  <CartQuantityControl item={item} />
                  <Link href={`/${item.slug}`}>Details</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
