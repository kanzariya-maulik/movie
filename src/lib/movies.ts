import dbConnect from '@/lib/db';
import Movie, { IMovie } from '@/models/Movie';
import mongoose from 'mongoose';

export interface GetMoviesOptions {
  page?: number;
  limit?: number;
  query?: string;
  genre?: string;
  year?: string | number;
  rating?: string | number;
  sort?: string;
}

export async function getMovies({
  page = 1,
  limit = 18,
  query,
  genre,
  year,
  rating,
  sort = 'newest'
}: GetMoviesOptions) {
  await dbConnect();

  const skip = (page - 1) * limit;
  let filter: Record<string, any> = {};

  // Search Query
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { genres: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ];
  }

  // Genre Filter
  if (genre && genre !== 'All') {
    filter.genres = genre;
  }

  // Year Filter
  if (year && year !== 'All') {
    filter.releaseYear = typeof year === 'string' ? parseInt(year) : year;
  }

  // Rating Filter
  if (rating && rating !== 'All') {
    filter.imdbRating = { $gte: typeof rating === 'string' ? parseFloat(rating) : rating };
  }

  // Sort Logic
  let sortStage: any = { createdAt: -1 }; // Default
  
  if (query) {
    sortStage = { createdAt: -1 }; 
  }

  switch (sort) {
    case 'oldest': sortStage = { createdAt: 1 }; break;
    case 'year_desc': sortStage = { releaseYear: -1 }; break;
    case 'year_asc': sortStage = { releaseYear: 1 }; break;
    case 'rating_desc': sortStage = { imdbRating: -1 }; break;
    case 'title_asc': sortStage = { title: 1 }; break;
    case 'title_desc': sortStage = { title: -1 }; break;
    case 'newest': 
    default: sortStage = { createdAt: -1 };
  }

  // Fetch count
  const totalMovies = await Movie.countDocuments(filter);
  const totalPages = Math.ceil(totalMovies / limit);

  // Fetch movies
  const movies = await Movie.find(filter)
    .sort(sortStage)
    .skip(skip)
    .limit(limit)
    .lean();

  // Serialization
  const serializedMovies = JSON.parse(JSON.stringify(movies));

  return {
    movies: serializedMovies,
    pagination: {
      currentPage: page,
      totalPages,
      totalMovies,
      hasMore: page < totalPages
    }
  };
}

export async function getGenres() {
  await dbConnect();
  const genres = await Movie.distinct('genres');
  return ['All', ...genres.sort()];
}
