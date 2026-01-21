'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Edit2, Trash2 } from 'lucide-react';

interface MovieCardProps {
  movie: {
    _id?: string;
    title: string;
    slug: string;
    posterUrl: string;
    imdbRating: number;
  };
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function MovieCard({ movie, isAdmin, onDelete }: MovieCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${movie.title}"?`) && onDelete && movie._id) {
      onDelete(movie._id);
    }
  };

  return (
    <div className="group relative">
      <Link href={`/movie/${movie.slug}`} className="block">
        <div
          className="relative h-full cursor-pointer overflow-hidden rounded-md bg-netflix-dark-grey transition-transform duration-300 hover:scale-105"
        >
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={movie.posterUrl}
              alt={`${movie.title} Movie Poster Download`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="p-3">
            <h3 className="line-clamp-1 text-sm font-semibold text-white md:text-base">
              {movie.title}
            </h3>
            <div className="mt-1 flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-400">{movie.imdbRating}</span>
            </div>
          </div>
        </div>
      </Link>

      {isAdmin && (
        <div className="absolute right-2 top-2 z-20 flex flex-col space-y-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link
            href={`/admin/movie/${movie._id}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-full bg-black/60 p-2 text-blue-400 backdrop-blur-sm transition hover:bg-netflix-red hover:text-white"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            className="rounded-full bg-black/60 p-2 text-netflix-red backdrop-blur-sm transition hover:bg-netflix-red hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
