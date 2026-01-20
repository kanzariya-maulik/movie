'use client';

import { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('my-favorites') || '[]');
        setFavorites(stored);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
    
    // Listen for updates if we add remove functionality on this page
    window.addEventListener('favorites-updated', loadFavorites);
    return () => window.removeEventListener('favorites-updated', loadFavorites);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black pt-24 text-white flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-netflix-red border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-netflix-black pb-20 pt-24 text-white md:pt-32">
         <div className="mx-auto max-w-[2000px] px-4 md:px-12">
            <div className="mb-8 flex items-center space-x-3">
              <Heart className="h-8 w-8 text-netflix-red fill-current" />
              <h1 className="text-3xl font-bold">My List</h1>
            </div>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {favorites.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <div className="rounded-full bg-white/10 p-6 mb-4">
                   <Heart className="h-12 w-12 text-gray-400" />
                 </div>
                 <h2 className="text-xl font-semibold text-white">Your list is empty</h2>
                 <p className="mt-2 text-gray-400">Add movies to your favorites to see them here.</p>
                 <Link href="/" className="mt-6 rounded bg-netflix-red px-6 py-2 font-medium text-white hover:bg-red-700">
                   Browse Movies
                 </Link>
              </div>
            )}
         </div>
      </div>
    </>
  );
}
