import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const { slug } = await params;
    const movie = await Movie.findOne({ slug });
    if (!movie) {
      return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
    }
    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching movie' }, { status: 500 });
  }
}
