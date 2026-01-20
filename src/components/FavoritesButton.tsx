'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface MoviePartial {
  _id: string;
  title: string;
  slug: string;
  posterUrl: string;
  imdbRating: number;
}

export default function FavoritesButton({ movie }: { movie: MoviePartial }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('my-favorites') || '[]');
    setIsFavorite(favorites.some((fav: MoviePartial) => fav._id === movie._id));
  }, [movie._id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('my-favorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((fav: MoviePartial) => fav._id !== movie._id);
    } else {
      newFavorites = [...favorites, {
        _id: movie._id,
        title: movie.title,
        slug: movie.slug,
        posterUrl: movie.posterUrl,
        imdbRating: movie.imdbRating
      }];
    }

    localStorage.setItem('my-favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    // Dispatch event for other components to listen (optional)
    window.dispatchEvent(new Event('favorites-updated'));
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`rounded-full p-3 transition ${
        isFavorite ? 'bg-white text-red-500' : 'bg-white/10 text-white hover:bg-white/20'
      }`}
      aria-label="Toggle Favorite"
    >
      <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
}
