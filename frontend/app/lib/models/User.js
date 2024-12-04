import mongoose from 'mongoose';
import HabitSchema from './Habit';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true },
    friends: [
      {
        uuid: { type: String, required: true },
        username: { type: String, required: true },
      },
    ],
    habits: [HabitSchema],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
