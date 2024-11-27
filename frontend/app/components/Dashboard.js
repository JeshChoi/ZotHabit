"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [friends, setFriends] = useState([]);
  const [quote, setQuote] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");

  useEffect(() => {
    const checkAuth = () => {
        const cookies = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_uuid="));
  
        if (!cookies) {
          // Redirect to login if no UUID cookie
          window.location.href = "/login";
        }
      };
  
    checkAuth();
    // Fetch habits and friends list
    async function fetchHabitsAndFriends() {
      try {
        const habitsResponse = await fetch("/api/habits");
        const friendsResponse = await fetch("/api/friends");

        if (!habitsResponse.ok || !friendsResponse.ok) {
          throw new Error("Failed to fetch habits or friends.");
        }

        const habitsData = await habitsResponse.json();
        const friendsData = await friendsResponse.json();

        setHabits(habitsData);
        setFriends(friendsData);
      } catch (error) {
        console.error("Error fetching habits or friends:", error);
      }
    }

    fetchHabitsAndFriends();

    // Fetch motivational quote
    async function fetchQuote() {
      try {
        const response = await fetch("/api/quote");

        if (!response.ok) {
          throw new Error("Failed to fetch quote.");
        }

        const data = await response.json();
        setQuote(data.text || "No quote available.");
        setQuoteAuthor(data.author || "Unknown");
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuote("Error fetching quote.");
        setQuoteAuthor("");
      }
    }

    fetchQuote();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={() => {
              // Clear the 'uuid' cookie
              document.cookie = "user_uuid=; path=/; max-age=0;";
              // Redirect to the login page
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Habits Section */}
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Your Habits
            </h2>
            {habits.length > 0 ? (
              habits.map((habit, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 py-2 last:border-none"
                >
                  <h3 className="font-medium text-gray-700">
                    {habit.habitName}
                  </h3>
                  <p className="text-sm text-gray-500">Goal: {habit.goal}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No habits to show.</p>
            )}
          </div>

          {/* Friends Section */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Friends
            </h2>
            {friends.length > 0 ? (
              friends.map((friend, index) => (
                <p key={index} className="py-1 text-gray-700">
                  {friend.username}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No friends to show.</p>
            )}
          </div>
        </div>

        {/* Motivational Quote Section */}
        <div className="bg-white p-4 mt-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Motivational Quote
          </h2>
          <p className="text-gray-700 italic">"{quote}"</p>
          <p className="text-gray-500 mt-2">- {quoteAuthor}</p>
        </div>
      </div>
    </div>
  );
}
