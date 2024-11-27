import { connectToDatabase } from '@/app/lib/db';
import User from '@/app/lib/models/User';

export async function POST(request) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return new Response(JSON.stringify({ message: 'All fields are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email already registered.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newUser = await User.create({ username, email, password, uuid: new Date().getTime().toString() });
    return new Response(JSON.stringify({ user: newUser }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
