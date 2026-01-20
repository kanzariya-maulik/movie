'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: {
    title: string;
    slug: string;
    posterUrl: string;
    imdbRating: number;
  };
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.slug}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative h-full cursor-pointer overflow-hidden rounded-md bg-netflix-dark-grey transition duration-200"
      >
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
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
      </motion.div>
    </Link>
  );
}
