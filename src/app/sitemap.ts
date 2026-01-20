import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();
  
  // Fetch all movies (slug and updatedAt)
  // Limit to 48000 to stay safely under the 50k URL limit per sitemap
  const movies = await Movie.find({}, { slug: 1, updatedAt: 1 })
    .sort({ updatedAt: -1 })
    .limit(48000) 
    .lean();

  const baseUrl = 'https://botad-movie.vercel.app';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Dynamic movie routes
  const movieRoutes: MetadataRoute.Sitemap = movies.map((movie: any) => ({
    url: `${baseUrl}/movie/${movie.slug}`,
    lastModified: new Date(movie.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...routes, ...movieRoutes];
}
