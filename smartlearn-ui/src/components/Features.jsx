function Features() {
  return (
    <div className="grid grid-cols-3 gap-10 px-16 mt-28">

      <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition">
        <h3 className="font-semibold text-xl">
          Adaptive MCQ Engine
        </h3>
        <p className="text-gray-500 mt-3">
          Questions adapt to your performance dynamically.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition">
        <h3 className="font-semibold text-xl">
          Smart Timer Mode
        </h3>
        <p className="text-gray-500 mt-3">
          Practice under real exam conditions.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition">
        <h3 className="font-semibold text-xl">
          Deep Analytics
        </h3>
        <p className="text-gray-500 mt-3">
          Identify weak areas and improve faster.
        </p>
      </div>

    </div>
  );
}

export default Features;