import mongoose from 'mongoose';
import HabitSchema from './Habit';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {type: String, required: true},
    password: { type: String, required: true },
    friends: [String],
    habits: [HabitSchema],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
