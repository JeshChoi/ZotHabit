import React, { useState } from "react";
import getUUID from "../utils/utils";
const HabitListItem = ({ habit, onComplete }) => {
    function getCount() {
        var res = 0
        for (let day of habit.progress) {
            res += day.count
        }
        return res
    }
    const [count, setCount] = useState(getCount());
    const [flash, setFlash] = useState(false);

    // Function to handle the click
    const handleClick = async () => {
        // Trigger the flash effect
        setFlash(true); 
        (async () => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          setFlash(false);
        })();
        // Update Habit

        // Check if goal reached already
        if (count >= habit.goal) {
          alert("Goal reached already");
          return
        } else
        {
          setCount(count + 1);
        }
        // data to send/update
        const date = new Date();
        const new_changes = {
            date: `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}` 
        }
        const existingDateEntry = habit.progress.find((elem) => elem.date === new_changes.date);
        if (existingDateEntry) {
          new_changes.count = existingDateEntry.count + (count + 1 - getCount())
        } else {
          new_changes.count = (count + 1 - getCount())
        }
      

        const data = {
            userId: getUUID(),
            habitId: habit._id,
            type: "progress",
            changes: new_changes,
        }

        
        const response = await fetch("/api/habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        // Reset the flash after 0.3 seconds
        if ( response.ok ) {
          onComplete();
        } else {
            // If error, 
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
        
        
    };

  return (
    <div
      className={`flex items-center p-4 mb-2 border rounded-md transition-all ${
        flash ? 'bg-green-500' : 'bg-white' // Change background color when flashing
      }`}
    >
      <div
        onClick={handleClick}
        className={`h-6 w-6 cursor-pointer lg flex items-center justify-center transition-all`}>
        <span className="text-lg">{'+'}</span>
      </div>
        <div className="ml-3">
            <h3 className="text-lg font-semibold">{habit.habitName}</h3>
        </div>
        <div className="ml-auto">
            <p>
            {count} / {habit.goal}
            </p>
        </div>
    </div>
  );
};

export default HabitListItem;
