'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { MENU_PRODUCTS } from '../config/products';

const FAVORITES_STORAGE_KEY = 'tiffinnest-favorites';

type FavoritesContextType = {
  favoriteSlugs: string[];
  favoriteCount: number;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function parseFavoriteSlugs(value: string | null): string[] {
  if (!value) return [];

  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error('Saved favorites must be a list.');
  }

  return [...new Set(parsed.filter(
    (slug): slug is string =>
      typeof slug === 'string' && MENU_PRODUCTS.some((product) => product.slug === slug),
  ))];
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false);

  useEffect(() => {
    try {
      setFavoriteSlugs(parseFavoriteSlugs(window.localStorage.getItem(FAVORITES_STORAGE_KEY)));
    } catch (error) {
      console.error('Could not load saved favorites.', error);
    } finally {
      setHasLoadedFavorites(true);
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== FAVORITES_STORAGE_KEY && event.key !== null) return;
      try {
        setFavoriteSlugs(parseFavoriteSlugs(event.newValue));
      } catch (error) {
        console.error('Could not sync saved favorites.', error);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!hasLoadedFavorites) return;
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteSlugs));
    } catch (error) {
      console.error('Could not save favorites.', error);
    }
  }, [favoriteSlugs, hasLoadedFavorites]);

  const isFavorite = (slug: string) => favoriteSlugs.includes(slug);
  const toggleFavorite = (slug: string) => {
    if (!MENU_PRODUCTS.some((product) => product.slug === slug)) {
      throw new Error(`Unknown favorite item: ${slug}`);
    }
    setFavoriteSlugs((current) =>
      current.includes(slug)
        ? current.filter((favoriteSlug) => favoriteSlug !== slug)
        : [...current, slug],
    );
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteSlugs, favoriteCount: favoriteSlugs.length, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
}
