import { useNavigate, useLocation } from "react-router-dom";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score = 0, total = 10 } = location.state || {};
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Quiz Results</h1>
            <p className="text-gray-500">Data Structures & Algorithms · Completed Apr 2, 2026</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center mb-8">
          <div className="w-40 h-40 mx-auto rounded-full border-4 border-orange-100 flex flex-col items-center justify-center mb-6">
            <span className="text-6xl font-bold text-orange-500">{score}/{total}</span>
            <span className="text-sm text-gray-500 mt-2">Score</span>
          </div>

          <h2 className="text-3xl font-bold mb-2">
            {percentage >= 70 ? "🎉 Great Job!" : "Keep Practicing!"}
          </h2>

          <p className="text-gray-600 mb-6">
            You scored {percentage}% on this quiz. 
            {percentage >= 70 ? " Excellent performance!" : " Review the topics and try again."}
          </p>

          {/* Performance Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 font-bold text-2xl">{score}</p>
              <p className="text-gray-600 text-sm">Correct</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-600 font-bold text-2xl">{total - score}</p>
              <p className="text-gray-600 text-sm">Incorrect</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 font-bold text-2xl">{percentage}%</p>
              <p className="text-gray-600 text-sm">Accuracy</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/quiz")}
            className="px-6 py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            View Analytics
          </button>
        </div>

        {/* Review Section Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h3 className="text-xl font-bold mb-6">Review Your Answers</h3>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <p className="font-semibold text-green-700">✓ Question 1 - Correct</p>
              <p className="text-sm text-gray-600">Which data structure follows LIFO? - Stack</p>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
              <p className="font-semibold text-red-700">✗ Question 2 - Incorrect</p>
              <p className="text-sm text-gray-600">What is the time complexity of binary search?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
