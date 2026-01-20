import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import Notification from '@/models/Notification';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const movieId = (await params).id;
    const movie = await Movie.findByIdAndUpdate(movieId, data, { new: true });
    
    if (!movie) {
      return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
    }

    // Create notification
    await Notification.create({
      type: 'movie_updated',
      message: `Movie updated: ${movie.title}`,
      link: `/movie/${movie.slug}`,
    });

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating movie' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting movie' }, { status: 500 });
  }
}
