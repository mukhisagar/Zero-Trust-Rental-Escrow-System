import { useState } from "react";
import { login } from "../utils/apiAuth";

const Login = ({ setToken, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await login(email, password);
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem("token", result.token);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Login
      </h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="text-center mt-4 text-sm text-gray-600">
        Demo: tenant@test.com / tenant123
      </p>
    </div>
  );
};

export default Login;
