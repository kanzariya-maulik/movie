import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, Download, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';
import { Metadata } from 'next';
import { generateBreadcrumbSchema, generateMovieSchema, generateFAQSchema } from '@/lib/seo';
import MovieCard from '@/components/MovieCard';
import FavoritesButton from '@/components/FavoritesButton';

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
  const movies = await Movie.find({
    genres: { $in: genres },
    _id: { $ne: currentId }
  })
  .sort({ imdbRating: -1 })
  .limit(6)
  .lean();

  return JSON.parse(JSON.stringify(movies));
}

async function getTrendingMovies() {
  await dbConnect();
  const movies = await Movie.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  return JSON.parse(JSON.stringify(movies));
}

async function getSeriesMovies(seriesName: string, currentId: string) {
  if (!seriesName) return [];
  await dbConnect();
  const movies = await Movie.find({
    series: seriesName,
    _id: { $ne: currentId }
  }).lean();
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
  const langSuffix = movie.languages && movie.languages.length > 0 ? ` [${movie.languages.join('/')}]` : '';
  const title = `${movie.title} (${releaseYear})${langSuffix} Full Movie Download | Botad Movies`;
  const description = `Download ${movie.title} (${releaseYear}) full movie in HD quality${langSuffix}. Direct download links, cast, and story included.`;

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
  const [relatedMovies, trendingMovies, seriesMovies] = await Promise.all([
    getRelatedMovies(movie.genres || [], movie._id),
    getTrendingMovies(),
    getSeriesMovies(movie.series, movie._id)
  ]);

  const jsonLd = generateMovieSchema({
    title: movie.title,
    description: movie.description,
    image: movie.posterUrl,
    rating: movie.imdbRating,
    dateCreated: movie.createdAt,
  });

  const faqJsonLd = generateFAQSchema(movie.title);

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <nav className="mb-4 flex items-center space-x-2 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          {movie.genres && movie.genres.length > 0 && (
            <>
              <Link 
                href={`/genre/${movie.genres[0].toLowerCase().replace(/\s+/g, '-')}`} 
                className="hover:text-white transition"
              >
                {movie.genres[0]}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-300 truncate">{movie.title}</span>
        </nav>

        <Link href="/" className="mb-8 flex items-center space-x-2 text-gray-400 transition hover:text-white">
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Browse</span>
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-9">
            {/* Main Info */}
            <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-10">
              <div className="relative mx-auto h-[400px] w-full max-w-[280px] overflow-hidden rounded-lg shadow-2xl md:col-span-4 md:mx-0 md:h-[450px] md:max-w-none lg:col-span-4">
                <Image
                  src={movie.posterUrl}
                  alt={`${movie.title} (${movie.releaseYear}) Full Movie Download`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, 400px"
                  priority
                />
              </div>

              <div className="md:col-span-8 lg:col-span-8">
                <div className="flex items-start justify-between">
                   <h1 className="text-3xl font-bold md:text-5xl lg:text-6xl">{movie.title}</h1>
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
                  <Link 
                    href={`/year/${movie.releaseYear || new Date(movie.createdAt).getFullYear()}`}
                    className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-300 hover:bg-white/20 transition"
                  >
                    {movie.releaseYear || new Date(movie.createdAt).getFullYear()}
                  </Link>
                  <div className="flex flex-wrap gap-2">
                     {movie.genres?.slice(0, 5).map((g: string) => (
                       <Link 
                         key={g} 
                         href={`/genre/${g.toLowerCase().replace(/\s+/g, '-')}`}
                         className="bg-netflix-red text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-red-700 transition shadow-lg shadow-netflix-red/20"
                       >
                         {g}
                       </Link>
                     ))}
                  </div>
                </div>
                
                {movie.cast && movie.cast.length > 0 && (
                   <div className="mt-6 text-sm text-gray-400">
                     <span className="font-semibold text-gray-300">Starring:</span> {movie.cast.join(', ')}
                   </div>
                )}

                <p className="mt-8 text-lg leading-relaxed text-gray-300">
                  {movie.description}
                </p>

                {/* Series Section */}
                {seriesMovies.length > 0 && (
                  <div className="mt-8 rounded-lg border border-netflix-red/30 bg-netflix-red/5 p-4">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-netflix-red">Part of the Series</h3>
                    <div className="flex flex-wrap gap-3">
                      {seriesMovies.map((m: any) => (
                        <Link 
                          key={m.slug} 
                          href={`/movie/${m.slug}`}
                          className="text-sm text-white hover:text-netflix-red underline decoration-netflix-red/30 underline-offset-4"
                        >
                          {m.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specs Table */}
                <div className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  <div className="bg-white/10 px-4 py-2 font-bold text-sm uppercase tracking-wider">Technical Specifications</div>
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-500">Language</th>
                        <td className="px-4 py-3">{movie.languages?.join(', ') || 'English'}</td>
                      </tr>
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-500">Quality / Resolution</th>
                        <td className="px-4 py-3">{movie.quality || 'HD'} / {movie.resolution || '1080p'}</td>
                      </tr>
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-500">File Size</th>
                        <td className="px-4 py-3">{movie.size || '1.2 GB'}</td>
                      </tr>
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-500">Audio</th>
                        <td className="px-4 py-3">{movie.audio || 'Dolby Digital 5.1'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Download Section */}
                <div className="mt-12 rounded-xl bg-netflix-red/10 p-6 ring-1 ring-netflix-red/20 md:p-8">
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

            {/* Screenshots Section */}
            {movie.screenshots && movie.screenshots.length > 0 && (
              <div className="mt-16">
                <h2 className="mb-6 text-2xl font-semibold">Screenshots</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {movie.screenshots.map((url: string, index: number) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg bg-netflix-dark-grey ring-1 ring-white/10">
                      <Image
                        src={url}
                        alt={`${movie.title} Screenshot ${index + 1}`}
                        fill
                        className="object-cover transition duration-300 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            <div className="mt-20">
              <h2 className="mb-8 text-2xl font-bold">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="rounded-lg border border-white/5 bg-white/5 p-6">
                  <h3 className="mb-2 font-bold text-lg text-white">How to download {movie.title} in HD?</h3>
                  <p className="text-gray-400">Click on any of the active download links above. The links will take you to high-speed cloud mirrors. For the best experience, use a download manager like IDM or JDownloader.</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-6">
                  <h3 className="mb-2 font-bold text-lg text-white">Is {movie.title} available in Hindi Dubbed?</h3>
                  <p className="text-gray-400">Please check the Audio section in our Technical Specifications table. We prioritize Dual Audio (Hindi-English) releases for our Indian users.</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-6">
                  <h3 className="mb-2 font-bold text-lg text-white">Is this download safe?</h3>
                  <p className="text-gray-400">Yes, at Botad Movies, we verify every link to ensure it's free from malware. However, we always recommend having an active antivirus and adblocker while browsing the web.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28 space-y-10">
              {/* Trending Sidebar */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h2 className="mb-6 text-xl font-bold border-b border-netflix-red pb-2 inline-block">Trending Now</h2>
                <div className="space-y-6">
                  {trendingMovies.map((trend: any) => (
                    <Link key={trend.slug} href={`/movie/${trend.slug}`} className="group flex gap-3 items-center">
                      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded shadow-lg">
                        <Image
                          src={trend.posterUrl}
                          alt={trend.title}
                          fill
                          className="object-cover transition group-hover:scale-110"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-medium group-hover:text-netflix-red transition">{trend.title}</h4>
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span>{trend.imdbRating}</span>
                          <span>•</span>
                          <span>{trend.releaseYear}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>
        </div>

        {/* Related Section Full Width */}
        {relatedMovies.length > 0 && (
          <div className="mt-24">
            <h2 className="mb-8 text-2xl font-bold md:text-3xl text-netflix-red underline decoration-2 underline-offset-8">You Might Also Like</h2>
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
