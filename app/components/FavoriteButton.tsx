'use client';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import type { Product } from '../config/products';
import { useFavorites } from '../context/FavoritesContext';
import { TEXT } from '../constants';

export default function FavoriteButton({
  slug,
  title,
  className = '',
}: {
  slug: Product['slug'];
  title: string;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(slug);

  return (
    <button
      aria-label={`${favorite ? TEXT.favorites.remove : TEXT.favorites.add} ${title} ${favorite ? TEXT.favorites.from : TEXT.favorites.to} ${TEXT.favorites.collection}`}
      aria-pressed={favorite}
      className={`favorite-button ${className}`.trim()}
      onClick={() => toggleFavorite(slug)}
      type="button"
    >
      {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </button>
  );
}
