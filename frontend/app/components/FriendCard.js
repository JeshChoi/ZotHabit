import { useState, useEffect } from "react";
import FriendHabitListItem from "./FriendHabitListItem";
import getUUID from "../utils/utils";

const FriendProfileCard = ({ friendName, onClose }) => {
  const [friendHabits, setFriendHabits] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // State for active tab (active or completed)
  const [loading, setLoading] = useState(true); // Loading state to handle fetching

  useEffect(() => {
    const fetchFriendHabits = async () => {
      setLoading(true); // Set loading state to true before fetching
      const friendsResponse = await fetch(`/api/habits?` + new URLSearchParams({ username: friendName }).toString());
      const friendsData = await friendsResponse.json();
      setFriendHabits(friendsData.habits);
      setLoading(false); // Set loading state to false after data is fetched
    };

    fetchFriendHabits();
  }, [friendName]); // Include friendName in dependency array

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-[800px] h-[600px] p-8 bg-white border border-gray-200 rounded-lg shadow-lg">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{friendName}</h3>
          <button
            className="text-gray-500 hover:text-black"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 text-lg font-semibold ${
              activeTab === "active"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Habits
          </button>
          <button
            className={`ml-6 py-2 px-4 text-lg font-semibold ${
              activeTab === "completed"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Habits
          </button>
        </div>

        {/* Content Section */}
        <div className="h-96 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500">Loading habits...</p>
          ) : friendHabits.length > 0 ? (
            <div>
              {friendHabits
                .filter((habit) =>
                  activeTab === "completed" ? !habit.isActive : habit.isActive
                ) // Show based on active tab
                .map((habit, index) => (
                  <div key={habit._id || index} className="border-b border-gray-200 py-2 last:border-none">
                    <FriendHabitListItem habit={habit} />
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">
              {activeTab === "completed"
                ? "No completed habits to show."
                : "No active habits to show."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


export default FriendProfileCard;
