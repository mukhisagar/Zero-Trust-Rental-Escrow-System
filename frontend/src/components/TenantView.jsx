import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract, waitForTx } from "../utils/ethersProvider.js";

const TenantView = ({ account }) => {
  const [properties, setProperties] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const contract = getContract();

  const fetchProperties = async () => {
    if (!contract) return;
    let nextId;
    try {
      nextId = await contract.nextPropertyId();
    } catch {
      nextId = ethers.toBigInt(1);
    }
    nextId = Number(nextId);
    const availProps = [];
    for (let i = 1; i <= nextId; i++) {
      try {
        const prop = await contract.getProperty(i);
        if (
          prop.tenant === "0x0000000000000000000000000000000000000000" &&
          !prop.fundsReleased
        ) {
          availProps.push({ id: i, depositAmount: prop.depositAmount });
        }
      } catch (e) {
        // Skip invalid
      }
    }
    setProperties(availProps);
  };

  const payDeposit = async () => {
    if (!selectedId || !contract) return;
    setLoading(true);
    try {
      const prop = await contract.getProperty(selectedId);
      const tx = await contract.payDeposit(selectedId, {
        value: prop.depositAmount,
      });
      await waitForTx(tx);
      alert("Deposit paid! Funds locked in escrow.");
      fetchProperties();
      setSelectedId(null);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
    const interval = setInterval(fetchProperties, 5000);
    return () => clearInterval(interval);
  }, [contract]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Tenant View</h2>

      {/* Available Properties */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6">
          Available Properties (Tenant Safety: Direct to Escrow)
        </h3>
        {properties.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No available properties. List one from Landlord Dashboard!
          </p>
        ) : (
          <div className="grid gap-6 max-h-96 overflow-y-auto">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="p-6 bg-primary-50 rounded-xl border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedId(prop.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold">Property #{prop.id}</h4>
                    <p className="text-primary-600 font-semibold text-lg">
                      Deposit: {ethers.formatEther(prop.depositAmount)} ETH
                    </p>
                  </div>
                  {selectedId === prop.id ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Selected
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      Book Now
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pay Action */}
      {selectedId && (
        <div className="p-6 bg-blue-50 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4">
            Book Property #{selectedId}
          </h3>
          <button
            onClick={payDeposit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
          >
            {loading ? "Paying..." : "Pay Deposit (Funds Locked Safely)"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TenantView;
