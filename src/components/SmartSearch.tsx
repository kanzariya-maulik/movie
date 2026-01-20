'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, Film } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Inline debounce hook if not exists to keep it self-contained for now
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface SearchResult {
  _id: string;
  title: string;
  slug: string;
  posterUrl: string;
  imdbRating: number;
  genres: string[];
}

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const debouncedQuery = useDebounceValue(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Limit to 5 specific results for suggestions
        const res = await fetch(`/api/movies?q=${encodeURIComponent(debouncedQuery)}&limit=5`);
        const data = await res.json();
        setResults(data.movies || []); // Handle paginated response structure
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowResults(false);
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative z-50">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          className="w-full rounded-full bg-black/40 border border-white/20 px-4 py-2 pl-10 text-white placeholder-gray-400 focus:border-netflix-red focus:outline-none focus:ring-1 focus:ring-netflix-red backdrop-blur-md transition-all"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </form>

      {/* Results Dropdown */}
      {showResults && debouncedQuery.length > 1 && (
        <div className="absolute top-12 left-0 right-0 z-40 overflow-hidden rounded-xl bg-[#181818] border border-white/10 shadow-2xl ring-1 ring-black/5">
          {results.length > 0 ? (
            <ul>
              {results.map((movie) => (
                <li key={movie._id} className="border-b border-white/5 last:border-0">
                  <Link
                    href={`/movie/${movie.slug}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-4 p-3 hover:bg-white/10 transition-colors"
                  >
                    <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate font-medium text-white">{movie.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="text-yellow-500">★ {movie.imdbRating}</span>
                        <span>•</span>
                        <span className="truncate">{movie.genres?.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="p-2">
                <button
                  onClick={handleSearch}
                  className="w-full rounded-lg bg-white/5 py-2 text-center text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  View all results for "{query}"
                </button>
              </li>
            </ul>
          ) : (
             <div className="p-4 text-center text-gray-500">
               {!loading && "No movies found."}
             </div>
          )}
        </div>
      )}
    </div>
  );
}
