import { connectToDatabase, getUser } from '@/app/lib/db';
import User from '@/app/lib/models/User';
import mongoose from 'mongoose'; 
import { NextApiRequest } from "next";


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
    const user = await User.findById(new mongoose.Types.ObjectId(userId) );
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    user.habits.push({
      habitName: habitName, 
      description: description, 
      goal: goal});
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


export async function GET(request) {  
  const userId = request.nextUrl.searchParams.get("userId");

  try {
    await connectToDatabase();
    const user = await User.findById(new mongoose.Types.ObjectId(userId) );
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
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