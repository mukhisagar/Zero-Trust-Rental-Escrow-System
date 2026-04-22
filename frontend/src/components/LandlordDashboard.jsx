import { useState, useEffect } from "react";
import {
  getProperties,
  createProperty,
  getEscrows,
  confirmEscrow,
} from "../utils/apiAuth";

const LandlordDashboard = ({ token, fakeBalance, setFakeBalance }) => {
  const [properties, setProperties] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    depositAmount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperties();
    loadEscrows();
  }, [token]);

  const loadProperties = async () => {
    try {
      const data = await getProperties(token);
      setProperties(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const loadEscrows = async () => {
    try {
      const data = await getEscrows(token);
      setEscrows(data);
    } catch (error) {
      console.error("Failed to load escrows:", error);
    }
  };

  const handleCreateProperty = async () => {
    setLoading(true);
    try {
      await createProperty(token, newProperty);
      setNewProperty({ title: "", description: "", depositAmount: 0 });
      loadProperties();
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Landlord Dashboard
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-6">Add Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Title"
              value={newProperty.title}
              onChange={(e) =>
                setNewProperty({ ...newProperty, title: e.target.value })
              }
              className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Description"
              value={newProperty.description}
              onChange={(e) =>
                setNewProperty({ ...newProperty, description: e.target.value })
              }
              className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Deposit ($)"
              value={newProperty.depositAmount}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  depositAmount: parseFloat(e.target.value) || 0,
                })
              }
              className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCreateProperty}
            disabled={loading}
            className="mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Property"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.isArray(properties) ? (
            properties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{prop.title}</h3>
                <p className="text-gray-600 mb-4">{prop.description}</p>
                <p className="text-2xl font-bold text-green-600">
                  ${prop.depositAmount}
                </p>
                <p className="text-sm text-gray-500">
                  Landlord: {prop.landlord?.email}
                </p>
              </div>
            ))
          ) : (
            <p>No properties</p>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Your Escrows
          </h2>
          <div className="grid gap-6">
            {Array.isArray(escrows) && escrows.length > 0 ? (
              escrows.map((escrow) => (
                <div
                  key={escrow.id}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl shadow-xl border-2 border-yellow-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {escrow.property.title}
                      </h3>
                      <p className="text-gray-600">
                        ID:{" "}
                        <span className="font-mono">{escrow.id.slice(-8)}</span>
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        escrow.status === "RELEASED"
                          ? "bg-green-100 text-green-800"
                          : escrow.status === "READY_TO_RELEASE"
                            ? "bg-blue-100 text-blue-800"
                            : escrow.landlordConfirmed && escrow.tenantConfirmed
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {escrow.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>Tenant: {escrow.tenant?.email || "N/A"}</div>
                    <div>Deposit: ${escrow.property.depositAmount}</div>
                    <div>
                      Landlord Confirmed:{" "}
                      {escrow.landlordConfirmed ? "✅" : "❌"}
                    </div>
                    <div>
                      Tenant Confirmed: {escrow.tenantConfirmed ? "✅" : "❌"}
                    </div>
                  </div>
                  {!escrow.released && (
                    <div className="flex gap-3">
                      <button
                        onClick={async () => {
                          try {
                            await confirmEscrow(token, escrow.id);
                            loadEscrows();
                          } catch (error) {
                            alert(error.message);
                          }
                        }}
                        className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600"
                      >
                        Confirm Move-Out
                      </button>
                      {escrow.status === "READY_TO_RELEASE" && (
                        <button
                          className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600"
                          onClick={async () => {
                            try {
                              await releaseEscrow(token, escrow.id);
                              loadEscrows();
                              // Simulate coin return to tenant (global balance increases)
                              setFakeBalance(
                                (prev) =>
                                  prev +
                                  parseFloat(escrow.property.depositAmount),
                              );
                              alert(
                                `Released ${escrow.property.depositAmount} Coins back to tenant!`,
                              );
                            } catch (error) {
                              alert(error.message);
                            }
                          }}
                        >
                          Release Deposit
                        </button>
                      )}
                    </div>
                  )}
                  {escrow.released && (
                    <div className="text-center py-4 bg-green-50 rounded-xl">
                      <span className="text-green-800 font-semibold">
                        ✅ Deposit Released
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-12">No escrows yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
