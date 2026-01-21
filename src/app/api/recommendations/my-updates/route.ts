import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Recommendation from '@/models/Recommendation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

    await dbConnect();

    // Find recommendations that are 'added' and match either userId or IP
    const query: any = { status: 'added' };
    if (userId) {
      query.$or = [{ userId }, { ip }];
    } else {
      query.ip = ip;
    }

    const updates = await Recommendation.find(query);

    return NextResponse.json(updates);
  } catch (error) {
    return NextResponse.json({ message: 'Error checking for updates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();
    await dbConnect();
    
    // Mark these as 'notified' so they don't pop up again
    await Recommendation.updateMany(
      { _id: { $in: ids } },
      { $set: { status: 'notified' } }
    );

    return NextResponse.json({ message: 'Marked as notified' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating notification status' }, { status: 500 });
  }
}
