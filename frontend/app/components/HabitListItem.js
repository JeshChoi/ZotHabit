import React, { useState } from "react";
import getUUID from "../utils/utils";
import HabitCard from "./HabitCard";

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
    const [isCardOpen, setIsCardOpen] = useState(false);

    const toggleCard = () => {
      setIsCardOpen(! isCardOpen);
    };
  
    // Function to handle the click
    const handleClick = async () => {
      if (! habit.isActive) { return; }
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
    <div className={`flex items-center p-4 mb-2 border rounded-md transition-all ${(!habit.isActive || flash) ? (flash ? 'border-green-500 bg-green-500' : 'border-green-300 bg-green-300' ) : 'border-gray-300 bg-white'}`}>
      <div onClick={handleClick}
        className={`h-6 w-6 cursor-pointer flex items-center justify-center transition-all ${
        !habit.isActive  ? 'bg-green-300' : ''}`}>
        {!habit.isActive ? '✔' : '+'}
      </div>
      <div className="ml-3">
        <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer hover:underline"
          onClick={toggleCard}>
          {habit.habitName}
        </h3>
      </div>
      <div className="ml-auto">
          <p>
          {count} / {habit.goal}
          </p>
      </div>
      {isCardOpen && <HabitCard habit={habit} onClose={toggleCard} />}

    </div>
  );
};

export default HabitListItem;
