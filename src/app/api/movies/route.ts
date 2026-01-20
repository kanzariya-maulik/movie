import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import Notification from '@/models/Notification';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    let filter = {};
    if (query) {
      filter = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      };
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(movies);
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
