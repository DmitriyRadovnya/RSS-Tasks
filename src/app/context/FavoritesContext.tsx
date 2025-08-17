'use client';

import { createContext, useContext, useState, ReactNode, FC } from 'react';
import { PokemonDetails } from '../../interfaces/interfaces';

interface FavoritesContextType {
  favorites: PokemonDetails[];
  addFavorite: (pokemon: PokemonDetails) => void;
  removeFavorite: (name: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<PokemonDetails[]>([]);

  const addFavorite = (pokemon: PokemonDetails) => {
    setFavorites((prev) => [...prev, pokemon]);
  };

  const removeFavorite = (name: string) => {
    setFavorites((prev) => prev.filter((p) => p.name !== name));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('The context is lost');
  }
  return context;
};
