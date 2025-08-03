import { useEffect, useState } from 'react';

export const usePokemonFromLS = () => {
  const [pokemonName, setPokemonName] = useState<string | null>(
    localStorage.getItem('pokemon') || null
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const savedPokemon = localStorage.getItem('pokemon');
      setPokemonName(savedPokemon || null);
    };

    window.addEventListener('pokemonStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('pokemonStorageChange', handleStorageChange);
    };
  }, []);

  const savePokemon = (name: string | null) => {
    if (name) {
      localStorage.setItem('pokemon', name.toLowerCase().trim());
    } else {
      localStorage.removeItem('pokemon');
    }
    window.dispatchEvent(new Event('pokemonStorageChange'));
    setPokemonName(name);
  };

  return { pokemonName, savePokemon };
};
