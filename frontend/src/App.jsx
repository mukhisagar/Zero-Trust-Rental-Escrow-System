import { useState, useEffect } from "react";
import Login from "./components/Login";
import LandlordDashboard from "./components/LandlordDashboard";
import TenantView from "./components/TenantView";
import FakeWallet from "./components/FakeWallet";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [fakeBalance, setFakeBalance] = useState(10.0); // Global coins

  const [currentEscrows, setCurrentEscrows] = useState([]);

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

  const handleDeposit = (amount) => {
    setFakeBalance((prev) => prev - amount);
    // Store escrow deposit info
  };

  const handleConfirm = () => {
    // Backend confirm already handled in dashboards
  };

  const handleReleaseCoins = (amount) => {
    setFakeBalance((prev) => prev + amount);
  };

  if (!token) {
    return <Login setToken={setToken} setUser={setUser} />;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-slate-100 p-6 shadow-2xl border-b-4 border-primary-500">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Rental Escrow DApp
          </h1>
          <div className="flex items-center gap-4 bg-slate-700/50 px-6 py-3 rounded-2xl">
            <span className="text-slate-200 font-semibold">
              {user?.email} ({user?.role})
            </span>
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent px-3 py-1 rounded-xl">
              💰 {fakeBalance.toFixed(2)} Coins
            </span>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <FakeWallet
        balance={fakeBalance}
        onDeposit={handleDeposit}
        onApprove={handleConfirm}
        onRelease={handleReleaseCoins}
        onAddCoins={(amount) =>
          setFakeBalance((prev) => prev + parseFloat(amount))
        }
      />

      {user?.role === "LANDLORD" ? (
        <LandlordDashboard
          token={token}
          fakeBalance={fakeBalance}
          setFakeBalance={setFakeBalance}
        />
      ) : (
        <TenantView
          token={token}
          fakeBalance={fakeBalance}
          setFakeBalance={setFakeBalance}
        />
      )}
    </>
  );
};

export default App;
