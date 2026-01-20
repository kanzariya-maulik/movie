import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import { getMovies, getGenres } from '@/lib/movies';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface YearPageProps {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: YearPageProps): Promise<Metadata> {
  const { year } = await params;
  
  return {
    title: `Best Movies of ${year} Download | Botad Movies`,
    description: `Download the best movies released in ${year}. High quality direct download links.`,
    alternates: {
      canonical: `https://botad-movie.vercel.app/year/${year}`,
    },
  };
}

export default async function YearPage({ params, searchParams }: YearPageProps) {
  const { year } = await params;
  const resolvedParams = await searchParams;
  
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
  const genre = typeof resolvedParams.genre === 'string' ? resolvedParams.genre : undefined;
  const rating = typeof resolvedParams.rating === 'string' ? resolvedParams.rating : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined;

  const [data, genres] = await Promise.all([
    getMovies({ page, year, genre, rating, sort }),
    getGenres()
  ]);

  if (data.movies.length === 0 && page === 1) {
    // Check if it's a valid year format
    if (!/^\d{4}$/.test(year)) {
        notFound();
    }
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
