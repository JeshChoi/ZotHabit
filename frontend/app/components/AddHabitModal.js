"use client";

import React, { useState } from 'react';
import getUUID from '../utils/utils';
export default function AddHabitModal({ isOpen, onClose }) {

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    // Add userID
    // Assume on Dashboard, thus cookie exist
    data.userId = getUUID();

      try {
        // Attempt to send it
        const response = await fetch("/api/habits", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          // If success, then close
          onClose()
        } else {
          // If error, 
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (err) {
        console.error("Error:", err);
        alert(err);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">New Habit</h2>
        <form id="AddModalForm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="habitName"
              name="habitName"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Goal</label>
            <input 
              type="number"
              min="1"
              id="goal"
              name="goal"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
        </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};
