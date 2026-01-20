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
