import { useState, useEffect } from "react";
import Login from "./components/Login";
import LandlordDashboard from "./components/LandlordDashboard";
import TenantView from "./components/TenantView";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem("token");
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  if (!token) {
    return <Login setToken={setToken} setUser={setUser} />;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rental Escrow</h1>
          <div className="flex items-center gap-4">
            <span>
              {user?.email} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-primary-600 px-4 py-1 rounded-lg font-semibold hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {user?.role === "LANDLORD" ? (
        <LandlordDashboard token={token} />
      ) : (
        <TenantView token={token} />
      )}
    </>
  );
};

export default App;
