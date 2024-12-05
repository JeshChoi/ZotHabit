import React, { useState } from "react";

const CompletedHabitCard = ({ habit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100; // Set the maximum length for description before truncation

  const truncatedDescription = habit.description?.length > maxLength
    ? `${habit.description.slice(0, maxLength)}...`
    : habit.description;

  return (
    <div className="flex flex-col p-4 mb-4 border rounded-md bg-green-100 shadow-sm">
      <h3 className="text-xl font-semibold text-green-800">{habit.habitName}</h3>
      <p className="text-sm text-gray-700">
        Completed on:{" "}
        <span className="font-medium text-gray-900">{habit.completedDate}</span>
      </p>
      <p className="text-sm text-gray-700">
        Total Progress:{" "}
        <span className="font-medium text-gray-900">{habit.totalProgress}</span>
      </p>
      {habit.description && (
        <p className="text-sm text-gray-600 mt-2">
          <span className="font-semibold text-gray-700">Description:</span>{" "}
          {isExpanded ? habit.description : truncatedDescription}
          {habit.description.length > maxLength && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-blue-600 underline text-xs"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      )}
    </div>
  );
};

export default CompletedHabitCard;
