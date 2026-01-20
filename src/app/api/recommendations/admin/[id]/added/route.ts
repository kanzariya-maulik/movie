import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Recommendation from '@/models/Recommendation';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { sendMovieAddedEmail } from '@/lib/email';

export async function POST(
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
    const { movieSlug } = await request.json();
    const recId = (await params).id;

    const recommendation = await Recommendation.findById(recId);
    if (!recommendation) {
      return NextResponse.json({ message: 'Recommendation not found' }, { status: 404 });
    }

    recommendation.status = 'added';
    await recommendation.save();

    if (recommendation.email) {
      await sendMovieAddedEmail(
        recommendation.email,
        recommendation.movieName,
        `/movie/${movieSlug}`
      );
    }

    return NextResponse.json({ message: 'Marked as added and email sent' });
  } catch (error) {
    console.error('Error in /api/recommendations/admin/[id]/added POST:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}
