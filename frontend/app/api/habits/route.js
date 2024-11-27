import { connectToDatabase } from '@/app/lib/db';
import User from '@/app/lib/models/User';

export async function POST(request) {
  const { userId, habitName, description, goal } = await request.json();

  if (!userId || !habitName) {
    return new Response(JSON.stringify({ message: 'User ID and habit name are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    user.habits.push({ habitName, description, goal });
    await user.save();

    return new Response(JSON.stringify({ habits: user.habits }), {
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
