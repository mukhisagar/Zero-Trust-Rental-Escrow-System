import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import LandlordDashboard from "./components/LandlordDashboard";
import TenantView from "./components/TenantView";

function App() {
  const [account, setAccount] = useState(null);
  const [view, setView] = useState("connect"); // 'connect', 'landlord', 'tenant'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-900 to-primary-500 bg-clip-text text-transparent mb-4">
            To-Let Trust
          </h1>
          <p className="text-xl text-gray-600">
            Zero Brokerage • Smart Escrow • Tenant Safety
          </p>
        </header>

        {!account ? (
          <ConnectWallet setAccount={setAccount} />
        ) : (
          <>
            <div className="flex gap-4 mb-8">
              <p className="text-lg">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
              <button
                onClick={() => setAccount(null)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Disconnect
              </button>
            </div>
            <div className="flex gap-4 mb-8 justify-center">
              <button
                onClick={() => setView("landlord")}
                className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600"
              >
                Landlord Dashboard
              </button>
              <button
                onClick={() => setView("tenant")}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600"
              >
                Tenant View
              </button>
            </div>
            {view === "landlord" && <LandlordDashboard account={account} />}
            {view === "tenant" && <TenantView account={account} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
