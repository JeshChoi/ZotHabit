import React, { useState } from "react";
import getUUID from "../utils/utils";

const FriendsSection = ({ friends, onSearch}) => {
  async function addFriend(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    // Add userID
    // Assume on Dashboard, thus cookie exist
    data.userId = getUUID();
      try {
        // Attempt to send it
        const response = await fetch("/api/friends", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          // If success, then close
          onSearch()
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

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Friends</h2>
        <div className="flex items-center">
          <form onSubmit={addFriend} className="flex w-full">
            <input
              type="text"
              name="friendUsername"
              id="friendUsername"
              placeholder="Search username"
              className="w-full border border-gray-300 rounded-l px-3 py-1 focus:outline-none focus:ring focus:border-blue-500"
            />
            <button type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded-r hover:bg-blue-600 transition">
              🔍
            </button>
          </form>
        </div>
      </div>
      
      {friends.length > 0 ? (
        <div className="h-96 overflow-y-auto">
          {friends.map((friend, index) => (
            <div key={index} className="py-1 text-gray-700">
              {friend}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No friends to show.</p>
      )}
    </div>
  );
};

export default FriendsSection;
