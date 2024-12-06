const HabitCard = ({ habit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-96 h-96 p-6 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col">
        {/* Header with Habit Name and Close Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">{habit.habitName}</h3>
          <button
            className="text-gray-500 hover:text-black text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {! habit.isActive && (
          <div className="mb-4 text-green-600 font-bold">✔ Goal Completed!</div>
        )}
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Goal:</span> {habit.goal}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Progress:</span>{" "}
          {habit.progress.reduce((total, day) => total + day.count, 0)} /{" "}
          {habit.goal}
        </p>
        <p className="font-semibold text-gray-600 border-b pb-2">Description</p>
        <div className="order-t pt-2 h-full width overflow-y-scroll">
          <p className="text-gray-600">
            {habit.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
