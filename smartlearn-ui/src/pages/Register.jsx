import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-[400px] bg-white p-8 rounded-3xl shadow-lg border-t-4 border-orange-500">

        <div className="flex justify-between mb-4">
          <p className="text-orange-500 font-semibold tracking-widest">SMARTLEARN</p>
          <button className="px-4 py-1 border rounded-full">Register</button>
        </div>

        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="text-gray-500 mb-6">
          Start acing your exams today
        </p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 border rounded-lg mb-4"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-4"
        />
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 border rounded-lg mb-4"
        />

        <button
          onClick={handleRegister}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
        >
          Create Account
        </button>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <p className="mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-orange-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;