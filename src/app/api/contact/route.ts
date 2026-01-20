import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({ message: 'Message sent successfully!', contact: newContact }, { status: 201 });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
