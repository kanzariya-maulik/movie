import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Recommendation from '@/models/Recommendation';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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
    recommendation.movieSlug = movieSlug;
    await recommendation.save();

    return NextResponse.json({ message: 'Marked as added and user will be notified on next visit' });
  } catch (error) {
    console.error('Error in /api/recommendations/admin/[id]/added POST:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}
