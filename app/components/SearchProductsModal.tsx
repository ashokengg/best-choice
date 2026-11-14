'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MENU_PRODUCTS } from '../config/products';
import AvailabilityToggle from './AvailabilityToggle';
import FavoriteButton from './FavoriteButton';
import CartQuantityControl from './CartQuantityControl';

type SearchProductsModalProps = {
  searchTerm: string;
  onClose: () => void;
};

export default function SearchProductsModal({ searchTerm, onClose }: SearchProductsModalProps) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const results = MENU_PRODUCTS.filter((item) =>
    item.title.toLowerCase().includes(normalizedSearch),
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="search-products-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="search-products-title"
        aria-modal="true"
        className="search-products-modal"
        role="dialog"
      >
        <div className="search-products-heading">
          <div>
            <h2 id="search-products-title">Menu items</h2>
            <p>Results for “{searchTerm.trim()}”</p>
          </div>
          <button
            aria-label="Close search results"
            className="search-products-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        <div className="search-products-grid">
          {results.map((item) => {
            return (
              <article className="search-product-card" key={item.slug}>
                <FavoriteButton className="favorite-button--card" slug={item.slug} title={item.title} />
                <Image alt={item.title} height={70} src={item.img} width={100} />
                <h3>{item.title}</h3>
                <p className="search-product-tagline">{item.tagline}</p>
                <div className="search-product-availability">
                  <AvailabilityToggle slug={item.slug} title={item.title} />
                </div>
                <div className="search-product-actions">
                  <span className="search-product-price">₹{item.price}</span>
                  <CartQuantityControl item={item} />
                  <Link href={`/${item.slug}`} onClick={onClose}>
                    Details
                  </Link>
                </div>
              </article>
            );
          })}
          {results.length === 0 && (
            <p className="search-products-empty" role="status">
              No menu items match “{searchTerm.trim()}”.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
