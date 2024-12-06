import React, { useState } from "react";

const FriendHabitListItem = ({ habit }) => {
  return (
    <div className={`flex items-center p-4 mb-2 border rounded-md transition-all ${!habit.isActive ? 'border-green-300 bg-green-300' : 'border-gray-300 bg-white'}`}>
      {/* Habit Status Icon */}
      <div className={`h-6 w-6 flex items-center justify-center transition-all ${habit.isActive ? '' : 'bg-green-300'}`}>
        {habit.isActive ? '◯' : '✔'}
      </div>
      
      {/* Habit Name */}
      <div className="ml-3">
        <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer hover:underline">
          {habit.habitName}
        </h3>
      </div>
      
      {/* Habit Progress */}
      <div className="ml-auto">
        <p>
          {habit.progress.length !== 0 ? habit.progress.reduce((sum, day) => sum + day.count, 0) : 0} / {habit.goal}
        </p>
      </div>
    </div>
  );
};

export default FriendHabitListItem;
