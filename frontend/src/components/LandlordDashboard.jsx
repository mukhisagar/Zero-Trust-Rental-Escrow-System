import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { getContract, getSignerAddress } from "../utils/ethersProvider.js";

const LandlordDashboard = ({ account }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const contract = getContract();

  const listProperty = async () => {
    if (!contract || !depositAmount) return;
    setLoading(true);
    try {
      const amountWei = ethers.parseEther(depositAmount); // e.g., '0.01'
      const tx = await contract.listProperty(amountWei);
      await tx.wait();
      alert("Property listed!");
      setDepositAmount("");
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const confirmMoveOut = async (propertyId) => {
    try {
      const tx = await contract.confirmMoveOut(propertyId);
      await tx.wait();
      alert("Confirmed move-out!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Fetch user's properties (simplified, poll nextPropertyId)
  useEffect(() => {
    const fetchProperties = async () => {
      if (!contract) return;
      let nextId;
      try {
        nextId = await contract.nextPropertyId();
      } catch {
        nextId = ethers.toBigInt(1);
      }
      nextId = Number(nextId);
      const userProps = [];
      for (let i = 1; i <= nextId; i++) {
        try {
          const prop = await contract.getProperty(i);
          if (
            prop.landlord.toLowerCase() === account.toLowerCase() ||
            prop.tenant.toLowerCase() === account.toLowerCase()
          ) {
            userProps.push({
              id: i,
              landlord: prop.landlord,
              depositAmount: prop.depositAmount,
              tenant: prop.tenant,
              tenantPaid: prop.tenantPaid,
              landlordConfirmed: prop.landlordConfirmed,
              tenantConfirmed: prop.tenantConfirmed,
              fundsReleased: prop.fundsReleased,
            });
          }
        } catch (e) {
          // Invalid property ID, skip
        }
        if (
          prop.landlord.toLowerCase() === account.toLowerCase() ||
          prop.tenant.toLowerCase() === account.toLowerCase()
        ) {
          userProps.push({
            id: i,
            ...Object.fromEntries(
              Object.entries(prop).map(([k, v]) => [
                k,
                v instanceof Object ? v.toString() : v,
              ]),
            ),
          });
        }
      }
      setProperties(userProps);
    };
    fetchProperties();
    const interval = setInterval(fetchProperties, 5000);
    return () => clearInterval(interval);
  }, [contract, account]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Landlord Dashboard
      </h2>

      {/* List New Property */}
      <div className="mb-12 p-6 bg-primary-50 rounded-xl">
        <h3 className="text-2xl font-semibold mb-4">
          List Property (Zero Brokerage)
        </h3>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Deposit ETH (e.g., 0.01)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={listProperty}
            disabled={loading || !depositAmount}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Listing..." : "List Property"}
          </button>
        </div>
      </div>

      {/* Properties Table */}
      <div>
        <h3 className="text-2xl font-semibold mb-6">Your Properties</h3>
        {properties.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No properties yet. List one above!
          </p>
        ) : (
          <div className="grid gap-4">
            {properties.map((prop) => (
              <div key={prop.id} className="p-6 bg-gray-50 rounded-xl border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    ID: <span className="font-mono">{prop.id}</span>
                  </div>
                  <div>
                    Deposit:{" "}
                    {prop.depositAmount
                      ? ethers.formatEther(prop.depositAmount)
                      : "0"}{" "}
                    ETH
                  </div>
                  <div>
                    Tenant:{" "}
                    {prop.tenant ===
                    "0x0000000000000000000000000000000000000000"
                      ? "None"
                      : `${prop.tenant.slice(0, 6)}...`}
                  </div>
                  <div>Status: {prop.tenantPaid ? "Paid" : "Pending"}</div>
                </div>
                {prop.tenantPaid && !prop.fundsReleased && (
                  <button
                    onClick={() => confirmMoveOut(prop.id)}
                    className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600"
                  >
                    {prop.landlordConfirmed && prop.tenantConfirmed
                      ? "Funds Releasing..."
                      : "Confirm Move-Out"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;
