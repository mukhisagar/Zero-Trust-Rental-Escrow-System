import { useState, useEffect } from "react";
import {
  getProperties,
  createEscrow,
  getEscrows,
  confirmEscrow,
} from "../utils/apiAuth";

const TenantView = ({ token, fakeBalance, setFakeBalance }) => {
  const [properties, setProperties] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
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
      console.error(error);
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

  const handleSelectProperty = async () => {
    const depositAmount = parseFloat(selectedProperty.depositAmount);
    if (depositAmount > fakeBalance) {
      alert(
        `Insufficient FakeCoins! Need ${depositAmount}, have ${fakeBalance}`,
      );
      return;
    }

    setLoading(true);
    try {
      setFakeBalance(fakeBalance - depositAmount); // Deduct fake coins
      await createEscrow(token, { propertyId: selectedProperty.id });
      alert(`Escrow created! Paid ${depositAmount} FakeCoins (locked)`);
      setSelectedProperty(null);
      loadEscrows();
    } catch (error) {
      alert(error.message);
      setFakeBalance(fakeBalance + depositAmount); // Refund on fail
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tenant View</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.isArray(properties) ? (
            properties.map((property) => (
              <div
                key={property.id}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-blue-200 cursor-pointer"
                onClick={() => setSelectedProperty(property)}
              >
                <h3 className="text-2xl font-bold mb-3">{property.title}</h3>
                <p className="text-gray-600 mb-6">{property.description}</p>
                <div className="text-3xl font-bold text-blue-600 mb-6">
                  ${property.depositAmount}
                </div>
                <button className="w-full py-3 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700">
                  Rent This Property
                </button>
              </div>
            ))
          ) : (
            <p>No properties available</p>
          )}
        </div>

        {selectedProperty && (
          <div className="fixed bottom-8 right-8 bg-white p-6 rounded-2xl shadow-2xl border max-w-sm">
            <h3 className="text-xl font-bold mb-2">{selectedProperty.title}</h3>
            <p className="text-gray-600 mb-4">
              {selectedProperty.depositAmount} FakeCoins deposit
            </p>
            <button
              onClick={handleSelectProperty}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 mb-2"
            >
              {loading ? "Creating Escrow..." : "Start Rental (Pay FakeCoins)"}
            </button>
            <button
              onClick={() => setSelectedProperty(null)}
              className="w-full text-gray-500 text-sm underline"
            >
              Change Property
            </button>
          </div>
        )}

        <div className="mt-12">
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
                    <div>Landlord: {escrow.property.landlord.email}</div>
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
                        disabled={escrow.tenantConfirmed}
                      >
                        {escrow.tenantConfirmed
                          ? "✅ Confirmed"
                          : "Confirm Move-Out"}
                      </button>
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

export default TenantView;
