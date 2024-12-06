"use client";

import { useState, useEffect } from "react";
import AddHabitModal from "./AddHabitModal";
import HabitListItem from "./HabitListItem";
import getUUID from "../utils/utils";
import HabitSection from "./HabitSection";
import FriendsSection from "./FriendSection";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [friends, setFriends] = useState([]);
  const [quote, setQuote] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [username, setUsername] = useState("");
  async function fetchHabitsAndFriends() {
    try {
      const habitsResponse = await fetch(`/api/habits?` + new URLSearchParams({userId: getUUID()}).toString());
      const friendsResponse = await fetch(`/api/friends?` + new URLSearchParams({userId: getUUID()}).toString());


      const habitsData = await habitsResponse.json();
      const friendsData = await friendsResponse.json();
      console.log(friendsData.friends);

      setHabits(habitsData.habits);
      setFriends(friendsData.friends);
    } catch (error) {
      console.error("Error fetching habits or friends:", error);
    } 
  };

  async function getUsername() {
    try {
      const userResponse = await fetch(`/api/users?` + new URLSearchParams({userId: getUUID()}).toString());
      const user = await userResponse.json();
      return user.user.username;
    } catch (error) {
      console.error("Error fetching user:", error);
    } 
  };

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
    setUsername(getUsername());
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <AddHabitModal isOpen={isAddHabitModalOpen} onClose={closeHabitModal}/>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome {username},</h1>
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
          <HabitSection habits={habits} fetchHabitsAndFriends={fetchHabitsAndFriends} setAddHabitModalOpen={setAddHabitModalOpen} />

          <FriendsSection friends={friends} onSearch={fetchHabitsAndFriends}/>
        </div>
      </div>
    </div>
  );
}
