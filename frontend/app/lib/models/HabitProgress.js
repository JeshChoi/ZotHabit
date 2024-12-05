import mongoose from 'mongoose';

const HabitProgressSchema = new mongoose.Schema({
  date: { type: String, unique: true, required: true },
  count: { type: Number, default: 0 },
});

export default HabitProgressSchema;
