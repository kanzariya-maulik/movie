import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import { getMovies, getGenres } from '@/lib/movies';
import { Metadata } from 'next';

export const revalidate = 0; // Dynamic rendering for search/filters

export const metadata: Metadata = {
  title: 'Botad Movies - Download Movies in HD',
  description: 'Download latest movies in HD quality. The best collection of movies for free download.',
  alternates: {
    canonical: 'https://botad-movie.vercel.app',
  },
};

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
  const genre = typeof resolvedParams.genre === 'string' ? resolvedParams.genre : undefined;
  const year = typeof resolvedParams.year === 'string' ? resolvedParams.year : undefined;
  const rating = typeof resolvedParams.rating === 'string' ? resolvedParams.rating : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined;

  const [data, genres] = await Promise.all([
    getMovies({ page, query, genre, year, rating, sort }),
    getGenres()
  ]);

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
