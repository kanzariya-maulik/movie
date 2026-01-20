import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import { getMovies, getGenres } from '@/lib/movies';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

interface PaginationPageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PaginationPageProps): Promise<Metadata> {
  const { page } = await params;
  
  return {
    title: `Latest Movies - Page ${page} | Botad Movies`,
    description: `Browse latest movies download collection. Page ${page}.`,
    alternates: {
      canonical: `https://botad-movie.vercel.app/movies/page/${page}`,
    },
  };
}

export default async function PaginationPage({ params, searchParams }: PaginationPageProps) {
  const { page: pageStr } = await params;
  const page = parseInt(pageStr);
  
  if (isNaN(page) || page < 1) {
    notFound();
  }
  
  // If page is 1, redirect to home for canonical reasons
  if (page === 1) {
    redirect('/');
  }

  const resolvedParams = await searchParams;
  const genre = typeof resolvedParams.genre === 'string' ? resolvedParams.genre : undefined;
  const year = typeof resolvedParams.year === 'string' ? resolvedParams.year : undefined;
  const rating = typeof resolvedParams.rating === 'string' ? resolvedParams.rating : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined;

  const [data, genres] = await Promise.all([
    getMovies({ page, genre, year, rating, sort }),
    getGenres()
  ]);

  if (data.movies.length === 0 && page > 1) {
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
