'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import { Play, Info } from 'lucide-react';
import RecommendationForm from '@/components/RecommendationForm';

interface Movie {
  _id: string;
  title: string;
  slug: string;
  posterUrl: string;
  imdbRating: number;
  description: string;
  backdropUrl?: string;
}

function HomeContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q');
  const title = query ? `Search Results for "${query}"` : "Latest Releases";

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const url = query ? `/api/movies?q=${encodeURIComponent(query)}` : '/api/movies';
        const res = await fetch(url);
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const handleRandomMovie = () => {
    if (movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      const randomMovie = movies[randomIndex];
      router.push(`/movie/${randomMovie.slug}`);
    }
  };

  const featuredMovie = movies[0] || {
    title: "Welcome to Cinemax",
    description: "The ultimate destination for movie enthusiasts. Download your favorite films in high quality, anytime, anywhere. Experience the magic of cinema at your fingertips.",
    backdropUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
  };

  return (
    <div className="relative pb-20">
      {/* Hero Section */}
      <div className="relative h-[95vh] w-full">
        <div className="absolute inset-0">
          <img
            src={featuredMovie.backdropUrl || featuredMovie.posterUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"}
            alt="Hero"
            className="h-full w-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-1/4 left-4 space-y-4 md:left-12 lg:space-y-6 max-w-2xl">
          <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl">
            {featuredMovie.title}
          </h1>
          <p className="text-shadow text-sm text-gray-200 md:text-lg lg:text-xl line-clamp-3">
            {featuredMovie.description}
          </p>
          <div className="flex space-x-3">
            {movies.length > 0 && (
              <button 
                onClick={handleRandomMovie}
                className="flex items-center space-x-2 rounded bg-white px-5 py-2 text-black transition hover:bg-white/80 md:px-8 md:py-3 lg:text-xl"
              >
                <Play className="h-5 w-5 fill-current md:h-8 md:w-8" />
                <span className="font-semibold">Random Movie</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="px-4 md:px-12 mt-[-5rem] relative z-10">
        <h2 className="mb-6 text-xl font-semibold text-[#e5e5e5] md:text-2xl">
          {title}
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-netflix-dark-grey" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie: any) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Ad Placeholder */}
      <div className="mx-auto my-12 flex h-24 max-w-7xl items-center justify-center bg-white/5 border border-dashed border-gray-700 text-gray-500 text-sm">
        Google AdSense Placeholder
      </div>

      {/* Recommendation Section */}
      <section className="mt-20 px-4 md:px-12">
        <div className="mx-auto max-w-4xl rounded-xl bg-netflix-dark-grey p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Can't find what you're looking for?</h2>
          <p className="mb-8 text-gray-400">Let us know which movie you'd like to see on our platform, and we'll try to add it for you!</p>
          <RecommendationForm />
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-netflix-black text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-netflix-red border-t-transparent"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
