import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

export async function GET() {
  try {
    await dbConnect();
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(10);
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching notifications' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    await Notification.updateMany({ read: false }, { read: true });
    return NextResponse.json({ message: 'Notifications marked as read' });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating notifications' }, { status: 500 });
  }
}
