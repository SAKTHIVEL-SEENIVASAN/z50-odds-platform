import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MatchWithOdds } from '@/lib/types';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (matchId: string) => void;
  isFavorite: (matchId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('z50_favorites') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('z50_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((matchId: string) => {
    setFavorites((prev) =>
      prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]
    );
  }, []);

  const isFavorite = useCallback(
    (matchId: string) => favorites.includes(matchId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
