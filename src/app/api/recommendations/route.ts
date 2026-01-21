import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Recommendation from '@/models/Recommendation';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    
    await dbConnect();
    const { movieName, userId } = await request.json();
    if (!movieName) {
      return NextResponse.json({ message: 'Movie name is required' }, { status: 400 });
    }
    const rec = await Recommendation.create({ movieName, ip, userId });
    return NextResponse.json(rec, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error submitting recommendation' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const recommendations = await Recommendation.find({}).sort({ createdAt: -1 });
    return NextResponse.json(recommendations);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching recommendations' }, { status: 500 });
  }
}
