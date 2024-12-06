import { connectToDatabase, getHabitById, getUserByUsername, getUserByID } from '@/app/lib/db';
import HabitProgressSchema from '@/app/lib/models/HabitProgress';
import User from '@/app/lib/models/User';
import mongoose from 'mongoose'; 
import { NextApiRequest } from "next";

export async function PUT(request) {
  const { userId, friendUsername } = await request.json();
  if (!friendUsername) {
    return new Response(JSON.stringify({ message: "Friend's username is required." }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await getUserByID(userId);
    // Find Friend
    const newFriend = await getUserByUsername(friendUsername);
    if (! newFriend)
    {
      return new Response(JSON.stringify({ message: 'Username not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (user.friends.includes(newFriend.username))
    {
      return new Response(JSON.stringify({ message: "Friend added already." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    // For now, no need to confirm friend request and it adds both people

    user.friends.push( friendUsername );
    newFriend.friends.push( user.username );
    await user.save();
    await newFriend.save()

    return new Response(JSON.stringify({ friends: user.friends }), {
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
    const existingUser = await getUserByID(userId);
    return new Response(JSON.stringify({ friends: existingUser.friends }), {
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
