import mongoose from 'mongoose';
import User from './models/User';
const MONGO_URI = process.env.MONGO_CONNECTION_URI;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_CONNECTION_URI environment variable.');
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


export async function getUserByID(userId) {
  await connectToDatabase();
  const user = await User.findById(new mongoose.Types.ObjectId(userId) );
  return user
}

export async function getUserByUsername(username) {
  await connectToDatabase();
  const user = await User.findOne({ username});
  return user
}

export async function getHabitByName(user, habitName) {
  return user.habits.find((elem) => elem.habitName === habitName );
}

export function getHabitById(user, habitId) {
  return user.habits.find((elem) => elem._id == habitId );

}