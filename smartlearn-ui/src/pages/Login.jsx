import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-[400px] bg-white p-8 rounded-3xl shadow-lg border-t-4 border-orange-500">

        <div className="flex justify-between mb-4">
          <p className="text-orange-500 font-semibold tracking-widest">SMARTLEARN</p>
          <button className="px-4 py-1 border rounded-full">Login</button>
        </div>

        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-gray-500 mb-6">
          Sign in to continue your learning journey
        </p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full p-3 border rounded-lg mb-4"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
          className="w-full p-3 border rounded-lg mb-4"
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
        >
          Login
        </button>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}        <p className="mt-4 text-center text-gray-500">
          Don't have an account?{" "}
          <span
            className="text-orange-500 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register now
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;