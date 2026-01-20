import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie, { IMovie } from '@/models/Movie';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import Notification from '@/models/Notification';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const genre = searchParams.get('genre');
    const minRating = searchParams.get('minRating');
    const year = searchParams.get('year');
    const sort = searchParams.get('sort') || 'newest';
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '18');
    const skip = (page - 1) * limit;

    let filter: any = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { genres: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }
    
    if (genre && genre !== 'All') {
      filter.genres = genre;
    }

    if (minRating) {
      filter.imdbRating = { $gte: parseFloat(minRating) };
    }

    if (year && year !== 'All') {
      filter.releaseYear = parseInt(year);
    }

    // Pipeline for aggregation
    const pipeline: any[] = [{ $match: filter }];

    // Sorting Logic
    let sortStage: any = { createdAt: -1 }; // Default newest

    if (query) {
       // Combine search score with sort preference if needed, but usually search score wins
       // We keep search score as primary if query exists
       pipeline.push({
        $addFields: {
          searchScore: {
            $add: [
              { $cond: [{ $regexMatch: { input: "$title", regex: query, options: "i" } }, 10, 0] },
              { $cond: [{ $regexMatch: { input: "$description", regex: query, options: "i" } }, 1, 0] }
            ]
          }
        }
      });
      sortStage = { searchScore: -1, createdAt: -1 };
    } else {
      switch(sort) {
        case 'oldest': sortStage = { createdAt: 1 }; break;
        case 'year_desc': sortStage = { releaseYear: -1 }; break;
        case 'year_asc': sortStage = { releaseYear: 1 }; break;
        case 'rating_desc': sortStage = { imdbRating: -1 }; break;
        case 'title_asc': sortStage = { title: 1 }; break;
        case 'title_desc': sortStage = { title: -1 }; break;
        default: sortStage = { createdAt: -1 }; // newest
      }
    }
    
    pipeline.push({ $sort: sortStage });

    // Facet for pagination
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        movies: [{ $skip: skip }, { $limit: limit }]
      }
    });

    const result = await Movie.aggregate(pipeline);
    const movies = result[0].movies;
    const total = result[0].metadata[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      movies,
      pagination: {
        currentPage: page,
        totalPages,
        totalMovies: total,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error in /api/movies GET:', error);
    return NextResponse.json({ message: 'Error fetching movies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const movie = await Movie.create(data);

    // Create notification
    await Notification.create({
      type: 'movie_added',
      message: `New movie added: ${movie.title}`,
      link: `/movie/${movie.slug}`,
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating movie' }, { status: 500 });
  }
}
