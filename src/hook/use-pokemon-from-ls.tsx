'use client';

import { useEffect, useState } from 'react';

export const usePokemonFromLS = () => {
  const [pokemonName, setPokemonName] = useState<string | null>(null);

  useEffect(() => {
    const savedPokemon =
      typeof window !== 'undefined' ? localStorage.getItem('pokemon') : null;
    setPokemonName(savedPokemon || null);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedPokemon =
        typeof window !== 'undefined' ? localStorage.getItem('pokemon') : null;
      setPokemonName(savedPokemon || null);
    };

    window.addEventListener('pokemonStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('pokemonStorageChange', handleStorageChange);
    };
  }, []);

  const savePokemon = (name: string | null) => {
    if (typeof window !== 'undefined') {
      if (name) {
        localStorage.setItem('pokemon', name.toLowerCase().trim());
      } else {
        localStorage.removeItem('pokemon');
      }
      window.dispatchEvent(new Event('pokemonStorageChange'));
    }
    setPokemonName(name);
  };

  return { pokemonName, savePokemon };
};
