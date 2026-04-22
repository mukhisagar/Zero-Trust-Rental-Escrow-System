import { useState } from "react";

const FakeWallet = ({ balance = 10, onDeposit, onApprove, onAddCoins }) => {
  const [amount, setAmount] = useState("");
  const [addAmount, setAddAmount] = useState("5");
  const [show, setShow] = useState(false);

  const handleAddCoins = () => {
    const num = parseFloat(addAmount);
    if (num > 0) {
      onAddCoins(num);
      setAddAmount("");
      alert(`Added ${num} Coins! 💎`);
    }
  };

  const handleDeposit = () => {
    const num = parseFloat(amount);
    if (num > balance) {
      alert("Insufficient balance");
      return;
    }
    onDeposit(num);
    setAmount("");
  };

  return (
    <div className="fixed bottom-20 left-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-3xl shadow-2xl min-w-[320px] border-2 border-orange-400 z-50">
      <div className="flex justify-between items-center mb-2">
        <span>Wallet</span>
        <button onClick={() => setShow(!show)} className="text-sm underline">
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {show && (
        <div className="space-y-3">
          <div className="text-lg font-bold text-center">
            Balance: {balance.toFixed(2)} Coins 💰
          </div>

          {/* Deposit */}
          <div className="flex gap-2 bg-white/10 p-3 rounded-2xl">
            <input
              type="number"
              placeholder="0.50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 p-2 rounded-lg text-black bg-white"
              step="0.01"
              max={balance}
            />
            <button
              onClick={handleDeposit}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700"
              disabled={!amount || parseFloat(amount) > balance}
            >
              Lock →
            </button>
          </div>

          {/* Add Coins */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="5"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="flex-1 p-2 rounded-lg text-black bg-white"
              step="1"
              max="50"
            />
            <button
              onClick={handleAddCoins}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700"
            >
              Add Coins 💎
            </button>
          </div>

          {/* Approve */}
          <button
            onClick={onApprove}
            className="w-full p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-purple-700 shadow-lg"
          >
            Approve Move-Out ✅
          </button>
        </div>
      )}
    </div>
  );
};

export default FakeWallet;
