"use client";

import { useState, useEffect } from "react";
import AddHabitModal from "./AddHabitModal";
import HabitListItem from "./HabitListItem";
import getUUID from "../utils/utils";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [friends, setFriends] = useState([]);
  const [quote, setQuote] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");

  async function fetchHabitsAndFriends() {
    try {
      const habitsResponse = await fetch(`/api/habits?` + new URLSearchParams({userId: getUUID()}).toString());
      // const friendsResponse = await fetch("/api/friends");


      const habitsData = await habitsResponse.json();
      // const friendsData = await friendsResponse.json();

      setHabits(habitsData.habits);
      // setFriends(friendsData);
    } catch (error) {
      console.error("Error fetching habits or friends:", error);
    } 
  }
  useEffect(() => {
    const checkAuth = () => {
        const cookies = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_uuid="));
  
        if (!cookies) {
          // Redirect to login if no UUID cookie
          window.location.href = "/components/login";
        }
      };
  
    checkAuth();
    // Fetch habits and friends list
    
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
  
  const [isAddHabitModalOpen, setAddHabitModalOpen] = useState(false);
  const closeHabitModal = () => {
    fetchHabitsAndFriends();
    setAddHabitModalOpen(false);
  };
  const openHabitModal = () => setAddHabitModalOpen(true);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <AddHabitModal isOpen={isAddHabitModalOpen} onClose={closeHabitModal}/>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={() => {
              // Clear the 'uuid' cookie
              document.cookie = "user_uuid=; path=/; max-age=0;";
              // Redirect to the login page
              window.location.href = "/components/login";
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
        
        {/* Motivational Quote Section */}
        <div className="bg-white p-4 mt-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Motivational Quote
          </h2>
          <p className="text-gray-700 italic">"{quote}"</p>
          <p className="text-gray-500 mt-2">- {quoteAuthor}</p>
        </div>

        <div className="grid pt-4 grid-cols-1 md:grid-cols-3 gap-6">
          {/* Habits Section */}
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Your Habits
              </h2>

              <button className="ml-4 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                onClick={() => setAddHabitModalOpen(true)}>
                Add Habit
              </button>
            </div>
            {habits.length > 0 ? (
              habits.filter((elem) => elem.isActive).map((habit, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 py-2 last:border-none"
                >
                  <HabitListItem lastUpdated={habit.updatedAt} habit={habit} onComplete={fetchHabitsAndFriends} />
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
      </div>
    </div>
  );
}
