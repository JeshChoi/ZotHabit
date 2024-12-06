"use client";

import React, { useState } from "react";
import getUUID from "../utils/utils";
import HabitCard from "./HabitCard";

const HabitListItem = ({ habit, onComplete, onDelete, handleEditComplete }) => {
    function getCount() {
        var res = 0;
        for (let day of habit.progress) {
            res += day.count;
        }
        return res;
    }
    const [count, setCount] = useState(getCount());
    const [flash, setFlash] = useState(false);
    const [isCardOpen, setIsCardOpen] = useState(false);

    const toggleCard = () => {
        setIsCardOpen(!isCardOpen);
    };

    // Function to handle the habit progress update
    const handleClick = async () => {
        if (!habit.isActive) return;

        setFlash(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setFlash(false);

        if (count >= habit.goal) return;
        setCount(count + 1);

        const date = new Date();
        const new_changes = {
            date: `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`,
        };
        const existingDateEntry = habit.progress.find((elem) => elem.date === new_changes.date);
        if (existingDateEntry) {
            new_changes.count = existingDateEntry.count + (count + 1 - getCount());
        } else {
            new_changes.count = count + 1 - getCount();
        }

        const data = {
            userId: getUUID(),
            habitId: habit._id,
            type: "progress",
            changes: new_changes,
        };

        const response = await fetch("/api/habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            onComplete();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    };

    // Function to handle the delete button click
    const handleDelete = async () => {
        const data = {
            userId: getUUID(),
            habitName: habit.habitName,
        };

        const response = await fetch("/api/habits", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            onDelete(habit._id); // Call the onDelete callback to update the list
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className={`flex items-center p-4 mb-2 border rounded-md transition-all ${(!habit.isActive || flash) ? (flash ? 'border-green-500 bg-green-500' : 'border-green-300 bg-green-300') : 'border-gray-300 bg-white'}`}>
            <div onClick={handleClick}
                className={`h-6 w-6 cursor-pointer flex items-center justify-center transition-all ${
                !habit.isActive ? 'bg-green-300' : ''}`}>
                {!habit.isActive ? '✔' : '+'}
            </div>
            <div className="ml-3">
                <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer hover:underline"
                    onClick={toggleCard}>
                    {habit.habitName}
                </h3>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <p>
                    {count} / {habit.goal}
                </p>
                <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    onClick={handleDelete}>
                    Delete
                </button>
            </div>
            {isCardOpen && <HabitCard habit={habit} onClose={toggleCard} onEditComplete={handleEditComplete}/>}
        </div>
    );
};

export default HabitListItem;
