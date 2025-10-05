import { use } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score } = location.state || { score: 0 };
  const percentage = Math.round((score / 10) * 100);
  const restartQuiz = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white px-4">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
        Quiz Completed 🎉
      </h1>

      {/* Score Summary */}
      <div className="bg-white text-gray-800 shadow-lg rounded-xl p-6 w-full max-w-md text-center">
        <p className="text-2xl font-semibold mb-2">Your Score: {score} / 10</p>
        <p className="text-lg font-medium mb-4">Accuracy: {percentage}%</p>

        {/* Feedback Message */}
        {percentage === 100 && (
          <p className="text-green-600 font-bold">
            🔥 Perfect Score! You’re a genius!
          </p>
        )}
        {percentage >= 70 && percentage < 100 && (
          <p className="text-blue-600 font-semibold">
            👏 Great Job! Keep practicing.
          </p>
        )}
        {percentage < 70 && (
          <p className="text-red-600 font-semibold">
            💡 Don’t worry, you’ll get better!
          </p>
        )}
      </div>

      {/* Restart Button */}
      <button
        onClick={restartQuiz}
        className="mt-6 px-6 py-3 bg-white text-green-600 font-semibold text-lg rounded-xl shadow-md hover:bg-green-100 transition-all"
      >
        Restart Quiz
      </button>
    </div>
  );
}
