import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import { getMovies, getGenres } from '@/lib/movies';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface GenrePageProps {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { genre: genreSlug } = await params;
  const genres = await getGenres();
  
  const matchedGenre = genres.find(g => 
    g.toLowerCase().replace(/\s+/g, '-') === genreSlug.toLowerCase()
  );

  const displayGenre = matchedGenre || genreSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${displayGenre} Movies Download | Botad Movies`,
    description: `Browse and download the latest ${displayGenre} movies in HD quality. Updated daily.`,
    alternates: {
      canonical: `https://botad-movie.vercel.app/genre/${genreSlug}`,
    },
  };
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const { genre: genreSlug } = await params;
  const resolvedParams = await searchParams;
  
  const genres = await getGenres();
  
  // Find the actual genre string that matches the slug
  const matchedGenre = genres.find(g => 
    g.toLowerCase().replace(/\s+/g, '-') === genreSlug.toLowerCase()
  );

  if (!matchedGenre && genreSlug !== 'all') {
    notFound();
  }

  const decodedGenre = matchedGenre || genreSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const rating = typeof resolvedParams.rating === 'string' ? resolvedParams.rating : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined;

  const data = await getMovies({ 
    page, 
    genre: matchedGenre, 
    rating, 
    sort 
  });

  if (data.movies.length === 0 && page === 1 && !matchedGenre) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-netflix-black text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-netflix-red border-t-transparent"></div>
      </div>
    }>
      <HomeContent 
        initialMovies={data.movies} 
        initialGenres={genres} 
        pagination={data.pagination}
      />
    </Suspense>
  );
}
