'use client';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import type { Product } from '../config/products';
import { useFavorites } from '../context/FavoritesContext';

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
      aria-label={`${favorite ? 'Remove' : 'Add'} ${title} ${favorite ? 'from' : 'to'} favorites`}
      aria-pressed={favorite}
      className={`favorite-button ${className}`.trim()}
      onClick={() => toggleFavorite(slug)}
      type="button"
    >
      {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </button>
  );
}
