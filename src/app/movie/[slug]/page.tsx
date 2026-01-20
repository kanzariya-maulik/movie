'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Download, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function MovieDetails() {
  const { slug } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setMovie(data);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchMovie();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-netflix-black text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-netflix-red border-t-transparent"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-netflix-black text-white">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-4 text-gray-400">Movie not found</p>
        <Link href="/" className="mt-8 rounded bg-netflix-red px-6 py-2 font-semibold">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black pb-20 pt-24 text-white md:pt-32">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <Link href="/" className="mb-8 flex items-center space-x-2 text-gray-400 transition hover:text-white">
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Browse</span>
        </Link>

        {/* Main Info */}
        <div className="grid gap-10 md:grid-cols-12">
          <div className="relative mx-auto h-[450px] w-full max-w-[300px] overflow-hidden rounded-lg shadow-2xl md:col-span-4 lg:col-span-3">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            <h1 className="text-4xl font-bold md:text-6xl">{movie.title}</h1>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold">{movie.imdbRating}</span>
                <span className="text-gray-500">/ 10</span>
              </div>
              <span className="rounded border border-gray-600 px-2 py-0.5 text-xs text-gray-400 uppercase">
                Download Only
              </span>
            </div>
            <p className="mt-8 text-lg leading-relaxed text-gray-300">
              {movie.description}
            </p>

            {/* Screenshots Section */}
            {movie.screenshots && movie.screenshots.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6 text-2xl font-semibold">Screenshots</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {movie.screenshots.map((url: string, index: number) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg bg-netflix-dark-grey ring-1 ring-white/10">
                      <Image
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        fill
                        className="object-cover transition duration-300 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ad Placeholder */}
            <div className="mt-12 flex h-64 w-full items-center justify-center bg-white/5 border border-dashed border-gray-700 text-gray-500 text-sm">
              Google AdSense - Horizontal Ad Placeholder
            </div>

            {/* Download Section */}
            <div className="mt-12 rounded-xl bg-netflix-dark-grey p-8 ring-1 ring-white/10">
              <h2 className="mb-6 text-2xl font-semibold">Download Links</h2>
              <div className="flex flex-wrap gap-4">
                {movie.downloadButtons.map((btn: any, index: number) => (
                  <a
                    key={index}
                    href={btn.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 rounded bg-netflix-red px-8 py-4 font-bold transition hover:bg-red-700"
                  >
                    <Download className="h-5 w-5" />
                    <span>{btn.text}</span>
                  </a>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">
                Note: These links will open in a new tab. We recommend using a download manager for better speed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
