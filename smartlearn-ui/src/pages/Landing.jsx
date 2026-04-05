import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-6 bg-white shadow-sm">
        <h1 className="text-xl font-bold">
          <span className="text-orange-500">●</span> SmartLearn
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex justify-between items-center px-16 mt-20">
        <div className="max-w-2xl">
          <p className="text-orange-500 font-semibold tracking-wide mb-3">
            WHAT WE OFFER
          </p>

          <h1 className="text-6xl font-extrabold leading-tight">
            Everything you need to ace your exams
          </h1>

          <p className="text-gray-500 mt-6 text-lg">
            Sharpen your skills with adaptive MCQs, real-time timers, and detailed
            analytics.
          </p>

          <div className="mt-8 space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-full bg-orange-500 text-white text-lg font-semibold shadow-lg hover:bg-orange-600 transition"
            >
              Start Practice Now
            </button>

            <button className="px-8 py-4 rounded-full border border-gray-300 text-lg hover:bg-gray-100 transition">
              Explore Features →
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-2xl w-[380px] border">
          <div className="flex justify-between text-sm text-gray-500">
            <p>Question 6 of 10</p>
            <p className="text-orange-500 font-semibold">01:24</p>
          </div>

          <h3 className="mt-5 font-semibold text-lg">
            Which data structure follows LIFO?
          </h3>

          <div className="mt-5 space-y-3">
            <div className="p-3 border rounded-xl hover:bg-gray-50">
              A. Queue
            </div>
            <div className="p-3 border-2 border-blue-500 bg-blue-50 rounded-xl">
              B. Stack
            </div>
            <div className="p-3 border-2 border-green-500 bg-green-50 rounded-xl">
              C. Stack ✓
            </div>
            <div className="p-3 border rounded-xl hover:bg-gray-50">
              D. Linked List
            </div>
          </div>

          <div className="mt-5 h-2 bg-gray-200 rounded-full">
            <div className="h-2 w-2/3 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-3 gap-10 px-16 mt-28 mb-16">
        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-semibold text-xl">Adaptive MCQ Engine</h3>
          <p className="text-gray-500 mt-3">
            Questions adapt to your performance dynamically.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-semibold text-xl">Smart Timer Mode</h3>
          <p className="text-gray-500 mt-3">
            Practice under real exam conditions.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-semibold text-xl">Deep Analytics</h3>
          <p className="text-gray-500 mt-3">
            Identify weak areas and improve faster.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;