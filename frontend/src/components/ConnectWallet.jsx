import { useState } from "react";
import { initProvider, getSignerAddress } from "../utils/ethersProvider.js";

const ConnectWallet = ({ setAccount }) => {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await initProvider();
      const address = await getSignerAddress();
      setAccount(address);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Connect Wallet
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Securely connect MetaMask to interact with the escrow contract.
      </p>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20.5a2.5 2.5 0 01-5 0V18a2.5 2.5 0 01-5 0v-.5a2.5 2.5 0 015 0v2.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z"
              />
            </svg>
            Connect MetaMask
          </>
        )}
      </button>
    </div>
  );
};

export default ConnectWallet;
