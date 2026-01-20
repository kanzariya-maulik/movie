import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, Download, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';
import { Metadata } from 'next';
import { generateBreadcrumbSchema, generateMovieSchema } from '@/lib/seo';
import MovieCard from '@/components/MovieCard';
import FavoritesButton from '@/components/FavoritesButton';

// Revalidate every hour
export const revalidate = 3600;

interface MovieDetailsProps {
  params: Promise<{ slug: string }>;
}

async function getMovie(slug: string) {
  await dbConnect();
  const movie = await Movie.findOne({ slug }).lean();
  if (!movie) return null;
  return JSON.parse(JSON.stringify(movie));
}
async function getRelatedMovies(genres: string[], currentId: string) {
  await dbConnect();
  // Find movies that share at least one genre, exclude current movie, limit to 6
  const movies = await Movie.find({
    genres: { $in: genres },
    _id: { $ne: currentId }
  })
  .sort({ imdbRating: -1 }) // Show best rated related  movies
  .limit(6)
  .lean();

  return JSON.parse(JSON.stringify(movies));
}

export async function generateMetadata({ params }: MovieDetailsProps): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovie(slug);

  if (!movie) {
    return {
      title: 'Movie Not Found - Botad Movies',
      description: 'The requested movie could not be found.',
    };
  }

  const releaseYear = movie.releaseYear || new Date(movie.createdAt).getFullYear();
  const title = `${movie.title} (${releaseYear}) Full Movie Download | Botad Movies`;
  const description = `Download ${movie.title} full movie in HD. Cast, story, trailer, and direct download links.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: movie.posterUrl,
          width: 800,
          height: 600,
          alt: movie.title,
        },
      ],
      type: 'video.movie',
    },
    alternates: {
      canonical: `https://botad-movie.vercel.app/movie/${movie.slug}`,
    },
  };
}

export default async function MovieDetails({ params }: MovieDetailsProps) {
  const { slug } = await params;
  const movie = await getMovie(slug);

  if (!movie) {
    notFound();
  }

  // Fetch related movies in parallel (or after, but strictly needed for render)
  const relatedMovies = await getRelatedMovies(movie.genres || [], movie._id);

  const jsonLd = generateMovieSchema({
    title: movie.title,
    description: movie.description,
    image: movie.posterUrl,
    rating: movie.imdbRating,
    dateCreated: movie.createdAt,
  });

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', item: 'https://botad-movie.vercel.app' },
    { name: movie.title, item: `https://botad-movie.vercel.app/movie/${movie.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-netflix-black pb-20 pt-24 text-white md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <Link href="/" className="mb-8 flex items-center space-x-2 text-gray-400 transition hover:text-white">
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Browse</span>
        </Link>

        {/* Main Info */}
        <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-10">
          <div className="relative mx-auto h-[400px] w-full max-w-[280px] overflow-hidden rounded-lg shadow-2xl md:col-span-4 md:mx-0 md:h-[450px] md:max-w-none lg:col-span-3">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 280px, 400px"
              priority
            />
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            <div className="flex items-start justify-between">
               <h1 className="text-3xl font-bold md:text-6xl">{movie.title}</h1>
               <FavoritesButton movie={movie} />
            </div>
            <div className="mt-4 flex items-center flex-wrap gap-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold">{movie.imdbRating}</span>
                <span className="text-gray-500">/ 10</span>
              </div>
              <span className="rounded border border-gray-600 px-2 py-0.5 text-xs text-gray-400 uppercase">
                {movie.quality || 'HD'}
              </span>
              <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-300">
                {movie.releaseYear || new Date(movie.createdAt).getFullYear()}
              </span>
              <div className="flex gap-2">
                 {movie.genres?.slice(0, 3).map((g: string) => (
                   <span key={g} className="text-sm text-netflix-red">{g}</span>
                 ))}
              </div>
            </div>
            
            {/* Cast Section (Placeholder or Actual) */}
            {movie.cast && movie.cast.length > 0 && (
               <div className="mt-6 text-sm text-gray-400">
                 <span className="font-semibold text-gray-300">Starring:</span> {movie.cast.join(', ')}
               </div>
            )}

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
            
            <div className="mt-12 w-full overflow-hidden">
                <iframe 
                  src="//thubanoa.com/4/8913388" 
                  scrolling="no" 
                  frameBorder="0" 
                  width="728" 
                  height="90" 
                  style={{border: "none", overflow: "hidden", maxWidth: "100%"}} 
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
            </div>

            {/* Download Section */}
            <div className="mt-12 rounded-xl bg-netflix-dark-grey p-6 ring-1 ring-white/10 md:p-8">
              <h2 className="mb-6 text-xl font-semibold md:text-2xl">Download Links</h2>
              <div className="grid gap-4 sm:flex sm:flex-wrap">
                {movie.downloadButtons.map((btn: any, index: number) => (
                  <a
                    key={index}
                    href={btn.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 rounded bg-netflix-red px-6 py-4 font-bold transition hover:bg-red-700 md:px-8"
                  >
                    <Download className="h-5 w-5" />
                    <span className="text-sm md:text-base">{btn.text}</span>
                  </a>
                ))}
              </div>
              <p className="mt-6 text-xs text-gray-500 italic md:text-sm">
                Note: These links will open in a new tab. We recommend using a download manager for better speed.
              </p>
            </div>
          </div>
        </div>

        {/* Related Movies Section */}
        {relatedMovies.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-2xl font-bold md:text-3xl">You Might Also Like</h2>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {relatedMovies.map((related: any) => (
                <MovieCard key={related.slug} movie={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
