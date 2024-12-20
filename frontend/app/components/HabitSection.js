"use client";

import React, { useState } from "react";
import HabitListItem from "./HabitListItem"; // Import your HabitListItem component

const HabitSection = ({ habits, fetchHabitsAndFriends, setAddHabitModalOpen, setHabits }) => {
  const [activeTab, setActiveTab] = useState("active"); // Track active tab

  const handleDeleteHabit = (habitId) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit._id !== habitId));
  };
  const handleEditComplete = (updatedHabit) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit._id === updatedHabit._id ? updatedHabit : habit
      )
    );
  };
  

  return (
    <div className="col-span-2 h-full bg-white p-4 rounded shadow">
      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 text-lg font-semibold ${
            activeTab === "active"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Habits
        </button>
        <button
          className={`ml-6 py-2 px-4 text-lg font-semibold ${
            activeTab === "completed"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed Habits
        </button>
      </div>
      
      {/* Content Section */}
      <div className="h-96 overflow-y-auto">
      {(habits.length > 0 && habits
            .filter((elem) =>
              activeTab === "completed" ? !elem.isActive : elem.isActive
            ).length > 0) ? (
        <div>
          {habits
            .filter((elem) =>
              activeTab === "completed" ? !elem.isActive : elem.isActive
            ) // Show based on active tab
            .map((habit, index) => (
              <div
                key={index}
                className="border-b border-gray-200 py-2 last:border-none"
              >
                <HabitListItem
                  lastUpdated={habit.updatedAt}
                  habit={habit}
                  onComplete={fetchHabitsAndFriends}
                  onDelete={handleDeleteHabit}
                  handleEditComplete={handleEditComplete}
                />
              </div>
            ))}
        </div>
      ) : (
        <p className="text-gray-500">
          {activeTab === "completed"
            ? "No completed habits to show."
            : "No active habits to show."}
        </p>
      )}
      </div>

      {/* Add Habit Button */}
      {activeTab === "active" && (
        <button
          className="ml-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
          onClick={() => setAddHabitModalOpen(true)}
        >
          Add Habit
        </button>
      )}
    </div>
  );
};

export default HabitSection;
