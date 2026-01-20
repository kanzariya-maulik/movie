import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';

export async function GET() {
  try {
    await dbConnect();
    const genres = await Movie.distinct('genres');
    const sortedGenres = genres.filter(Boolean).sort();
    return NextResponse.json(['All', ...sortedGenres]);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json({ message: 'Error fetching genres' }, { status: 500 });
  }
}
