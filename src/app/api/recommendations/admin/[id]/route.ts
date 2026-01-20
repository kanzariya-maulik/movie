import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Recommendation from '@/models/Recommendation';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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

    const recommendation = await Recommendation.findById(id);
    if (!recommendation) {
      return NextResponse.json({ message: 'Recommendation not found' }, { status: 404 });
    }

    if (recommendation.status !== 'added') {
      return NextResponse.json({ message: 'Can only delete recommendations that are tagged as added' }, { status: 400 });
    }

    await Recommendation.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Recommendation deleted successfully' });
  } catch (error) {
    console.error('Error in /api/recommendations/admin/[id] DELETE:', error);
    return NextResponse.json({ message: 'Error deleting recommendation' }, { status: 500 });
  }
}
