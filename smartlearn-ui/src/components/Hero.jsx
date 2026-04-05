function Hero() {
  return (
    <div className="flex justify-between items-center px-16 mt-20">

      {/* LEFT */}
      <div className="max-w-2xl">
        <p className="text-orange-500 font-semibold tracking-wide mb-3">
          WHAT WE OFFER
        </p>

        <h1 className="text-6xl font-extrabold leading-tight">
          Everything you need to ace your exams
        </h1>

        <p className="text-gray-500 mt-6 text-lg">
          Sharpen your skills with adaptive MCQs, real-time timers,
          and detailed analytics.
        </p>

        <div className="mt-8 space-x-4">

          <button className="px-8 py-4 rounded-full bg-orange-500 text-white text-lg font-semibold shadow-lg hover:bg-orange-600 transition">
            Start Practice Now
          </button>

          <button className="px-8 py-4 rounded-full border border-gray-300 text-lg hover:bg-gray-100 transition">
            Explore Features →
          </button>

        </div>
      </div>

      {/* RIGHT CARD */}
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
  );
}

export default Hero;