function Navbar() {
  return (
    <div className="flex justify-between items-center px-12 py-6">

      <h1 className="text-xl font-bold">
        <span className="text-orange-500">●</span> SmartLearn
      </h1>

      <div className="space-x-4">
        <button className="px-4 py-2 rounded-full border">
          Login
        </button>

        <button className="px-5 py-2 rounded-full bg-orange-500 text-white">
          Register
        </button>
      </div>

    </div>
  );
}
export default Navbar;