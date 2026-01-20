'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import { Play, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import RecommendationForm from '@/components/RecommendationForm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import Image from 'next/image';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Movie {
  _id: string;
  title: string;
  slug: string;
  posterUrl: string;
  imdbRating: number;
  description: string;
  backdropUrl?: string;
  releaseYear?: number;
  quality?: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalMovies: number;
  hasMore: boolean;
}

interface HomeContentProps {
  initialMovies: Movie[];
  initialGenres: string[];
  pagination: PaginationProps;
}

export default function HomeContent({ initialMovies, initialGenres, pagination }: HomeContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);

  const query = searchParams.get('q');
  const selectedGenre = searchParams.get('genre') || 'All';
  const selectedRating = searchParams.get('rating') || 'All';
  const selectedYear = searchParams.get('year') || 'All';
  const selectedSort = searchParams.get('sort') || 'newest';

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 20}, (_, i) => currentYear - i);

  const title = query 
    ? `Search Results for "${query}"` 
    : selectedGenre !== 'All' 
      ? `${selectedGenre} Movies` 
      : "Latest Releases";

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setIsAdmin(data.authenticated);
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAuth();
  }, []);

  // Handlers
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'All' || value === 'newest') { 
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Reset to page 1 on filter change
    params.delete('page');
    router.push(`/?${params.toString()}`);
  }

  const handleRatingChange = (rating: string) => updateParams('rating', rating);
  const handleYearChange = (year: string) => updateParams('year', year);
  const handleSortChange = (sort: string) => updateParams('sort', sort);
  const handleGenreClick = (genre: string) => updateParams('genre', genre);

  const handleDeleteMovie = async (id: string) => {
    if(!confirm("Delete this movie?")) return;
    try {
      const res = await fetch(`/api/movies/admin/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // Force refresh to update list
        router.refresh();
      }
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleRandomMovie = () => {
    if (initialMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * initialMovies.length);
      const randomMovie = initialMovies[randomIndex];
      router.push(`/movie/${randomMovie.slug}`);
    }
  };

  const featuredMovie = initialMovies[0] || {
    title: "Welcome to Botad Movies",
    description: "The ultimate destination for movie enthusiasts. Download your favorite films in high quality, anytime, anywhere.",
    backdropUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
  };

  // Pagination Helper
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/?${params.toString()}`;
  };

  return (
    <div className="relative pb-20">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full md:h-[95vh]">
        <div className="absolute inset-0">
          <Image
            src={featuredMovie.backdropUrl || featuredMovie.posterUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"}
            alt={featuredMovie.title}
            fill
            className="object-cover brightness-[0.4]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-[15%] left-4 right-4 space-y-4 md:bottom-1/4 md:left-12 lg:space-y-6 max-w-2xl px-4 md:px-0">
          <h1 className="text-3xl font-bold md:text-6xl lg:text-7xl text-white drop-shadow-lg">
            {featuredMovie.title}
          </h1>
          <p className="text-shadow text-sm text-gray-200 md:text-lg lg:text-xl line-clamp-3">
            {featuredMovie.description}
          </p>
          <div className="flex space-x-3">
             <button 
                onClick={handleRandomMovie}
                className="flex items-center space-x-2 rounded bg-white px-5 py-2.5 text-black transition hover:bg-white/80 md:px-8 md:py-3 lg:text-xl font-bold"
              >
                <Play className="h-5 w-5 fill-current md:h-8 md:w-8" />
                <span className="text-sm md:text-base">Random Movie</span>
              </button>
          </div>
        </div>
      </div>

      <section className="px-4 md:px-12 -mt-16 md:mt-[-5rem] relative z-10">
        {/* Filter Bar */}
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0 text-white">
          {/* Genre Selector */}
          <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide md:pb-0 mask-image-linear-edges">
            {initialGenres.map((genre: string) => (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={cn(
                  "whitespace-nowrap rounded-full px-5 py-2 text-xs md:text-sm font-medium transition-all duration-300",
                  selectedGenre === genre
                    ? "bg-netflix-red text-white shadow-lg shadow-netflix-red/20"
                    : "bg-netflix-dark-grey text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center space-x-2 shrink-0">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedRating}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="rounded-lg bg-netflix-dark-grey px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-netflix-red"
              >
                <option value="All">All Ratings</option>
                <option value="9">9+ ⭐</option>
                <option value="8">8+ ⭐</option>
                <option value="7">7+ ⭐</option>
                <option value="6">6+ ⭐</option>
              </select>
            </div>

            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="rounded-lg bg-netflix-dark-grey px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-netflix-red"
            >
              <option value="All">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg bg-netflix-dark-grey px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-netflix-red"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="year_desc">Year (New)</option>
              <option value="rating_desc">Top Rated</option>
              <option value="title_asc">A-Z</option>
            </select>
          </div>
        </div>

        <h2 className="mb-6 text-lg font-semibold text-[#e5e5e5] md:text-2xl">
          {title} <span className="text-sm font-normal text-gray-500 ml-2">({pagination.totalMovies} movies)</span>
        </h2>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-12">
          {initialMovies.map((movie) => (
            <MovieCard 
              key={movie.slug} 
              movie={movie} 
              isAdmin={isAdmin}
              onDelete={handleDeleteMovie}
            />
          ))}
        </div>

        {initialMovies.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <p className="text-xl">No movies found matching your criteria.</p>
            <button onClick={() => router.push('/')} className="mt-4 text-netflix-red hover:underline">Clear all filters</button>
          </div>
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 py-8">
            {pagination.currentPage > 1 ? (
              <Link 
                href={createPageUrl(pagination.currentPage - 1)}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-netflix-dark-grey hover:bg-white/20 transition text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            ) : (
              <div className="h-10 w-10" />
            )}

            <span className="text-sm text-gray-400">
              Page <span className="text-white font-bold">{pagination.currentPage}</span> of {pagination.totalPages}
            </span>

            {pagination.currentPage < pagination.totalPages ? (
              <Link
                href={createPageUrl(pagination.currentPage + 1)}
                 className="flex items-center justify-center h-10 w-10 rounded-full bg-netflix-dark-grey hover:bg-white/20 transition text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            ) : (
              <div className="h-10 w-10" />
            )}
          </div>
        )}
      </section>

      {/* Ad Placeholder */}
      <div className="mx-auto my-12 flex h-24 max-w-7xl items-center justify-center bg-white/5 border border-dashed border-gray-700 text-gray-500 text-sm">
        Google AdSense Space
      </div>

      {/* Recommendation Section */}
      <section className="mt-20 px-4 md:px-12">
        <div className="mx-auto max-w-4xl rounded-xl bg-netflix-dark-grey p-8 text-center ring-1 ring-white/10">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl text-white">Request a Movie</h2>
          <p className="mb-8 text-gray-400">Can't find what you're looking for? Let us know!</p>
          <RecommendationForm />
        </div>
      </section>
    </div>
  );
}

