import { connectToDatabase, getUserByID, getHabitById, getUserByUsername } from '@/app/lib/db';
import HabitProgressSchema from '@/app/lib/models/HabitProgress';
import User from '@/app/lib/models/User';
import mongoose from 'mongoose'; 
import { NextApiRequest } from "next";


export async function PUT(request) {
  const { userId, habitName, description, goal } = await request.json();

  if (!userId || !habitName) {
    return new Response(JSON.stringify({ message: 'User ID and habit name are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = await getUserByID(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Lets have habit names be unique among user, prob should set up schema
    // like that but i'm getting tired
    const habitExists = user.habits.find((elem) => elem.habitName === habitName);
    if (habitExists)
    {
      return new Response(JSON.stringify({ message: 'Habit name exists already.' }), {
        status: 400,
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
    let user = null;
    if (userId)
    {
      user = await getUserByID(userId);
    } else 
    {
      const userUsername = request.nextUrl.searchParams.get("username");
      user = await getUserByUsername(userUsername);
    }
    
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

export async function POST(request) {
  const { userId, habitId, type, changes} = await request.json();
  console.log(userId, habitId, type, changes);

  try {
    const user = await getUserByID(userId);
    const selectedHabit = getHabitById(user, habitId);
    if ( !selectedHabit ) {
      console.error("Couldn't find Habit with ID: ", habitId);
      return new Response(JSON.stringify({ message: 'Internal server error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (type === "habit")
    {  
      // Changes Habit attribute
      for (key of changes) {
        selectedHabit.key = changes[key];
      }
    } else if (type === "progress") {
      // Changes HabitProgress List
      let selectedDate = selectedHabit.progress.find((elem) => elem.date === changes.date)
      if ( !selectedDate ) {
        // If date doesn't exist, create one
        selectedDate = {date: changes.date, count: changes.count};
        selectedHabit.progress.push( selectedDate );
      } else
      {
        // Update existing
        // Allow for more count than goal, cuz why not
        // More fun
        selectedDate.count = changes.count;
      }
      if (selectedDate.count >= selectedHabit.goal) {
        selectedHabit.isActive = false;
      }
    }
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