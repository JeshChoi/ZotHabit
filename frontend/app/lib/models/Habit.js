import mongoose from 'mongoose';
import HabitProgressSchema from './HabitProgress';

const HabitSchema = new mongoose.Schema({
  habitName: { type: String, required: true },
  description: { type: String },
  goal: { type: Number, default: 1 },
  progress: [HabitProgressSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default HabitSchema;
