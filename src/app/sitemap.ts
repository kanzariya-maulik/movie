import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await dbConnect();
    
    // Fetch all movies (slug and updatedAt)
    const movies = await Movie.find({}, { slug: 1, updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .limit(45000) 
      .lean();

    const baseUrl = 'https://botad-movie.vercel.app';

    // Fetch genres and years for sitemap
    const genres = await Movie.distinct('genres');
    const years = await Movie.distinct('releaseYear');

    const genreEntries: MetadataRoute.Sitemap = genres.map((genre: string) => ({
      url: `${baseUrl}/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    const yearEntries: MetadataRoute.Sitemap = years.map((year: number) => ({
      url: `${baseUrl}/year/${year}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    const movieEntries: MetadataRoute.Sitemap = movies.map((movie: any) => ({
      url: `${baseUrl}/movie/${movie.slug}`,
      lastModified: movie.updatedAt ? new Date(movie.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      ...genreEntries,
      ...yearEntries,
      ...movieEntries,
    ];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return [
      {
        url: 'https://botad-movie.vercel.app',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
