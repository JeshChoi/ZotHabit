import React, { useState } from "react";

const HabitCard = ({ habit, onClose, onEditComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHabit, setEditedHabit] = useState({
    habitName: habit.habitName,
    description: habit.description,
    goal: habit.goal,
  });

  const getUserIdFromCookies = () => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_uuid="));

    if (!cookies) {
      window.location.href = "/components/login";
      return null;
    }

    return cookies.split("=")[1]; // Extract the user UUID
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedHabit({ ...editedHabit, [name]: value });
  };

  const handleSave = async () => {
    const userId = getUserIdFromCookies();
    if (!userId) return;

    const data = {
      userId,
      habitName: habit.habitName,
      updates: editedHabit,
    };

    console.log(`Update data : ${JSON.stringify(data)}`)

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('reched')
        const updatedHabits = await response.json();
        console.log('reched 2')
        onEditComplete(updatedHabits.habits); // Pass updated habits to parent
        console.log('reched 3')
        setIsEditing(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Failed to update habit:", error);
      alert("An error occurred while saving changes.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-96 h-96 p-6 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col">
        {/* Header with Habit Name, Edit, and Close Buttons */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditing ? (
              <input
                type="text"
                name="habitName"
                value={editedHabit.habitName}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 text-gray-800 w-full"
              />
            ) : (
              habit.habitName
            )}
          </h3>
          <div className="flex items-center gap-2">
            <button
              className="text-blue-500 hover:text-blue-700 text-lg"
              onClick={handleEditToggle}
              aria-label="Edit"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              className="text-gray-500 hover:text-black text-2xl"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {!habit.isActive && (
          <div className="mb-4 text-green-600 font-bold">✔ Goal Completed!</div>
        )}

        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Goal:</span>{" "}
          {isEditing ? (
            <input
              type="number"
              name="goal"
              value={editedHabit.goal}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 text-gray-800 w-full"
            />
          ) : (
            habit.goal
          )}
        </p>

        <p className="font-semibold text-gray-600 border-b pb-2">Description</p>
        <div className="order-t pt-2 h-full width overflow-y-scroll">
          {isEditing ? (
            <textarea
              name="description"
              value={editedHabit.description}
              onChange={handleInputChange}
              className="border rounded px-2 py-1 text-gray-800 w-full h-24"
            />
          ) : (
            <p className="text-gray-600">{habit.description}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitCard;
