import { useState, useEffect } from "react";
import { getProperties, createEscrow } from "../utils/apiAuth";

const TenantView = ({ token }) => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [token]);

  const loadProperties = async () => {
    try {
      const data = await getProperties(token);
      setProperties(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectProperty = async () => {
    setLoading(true);
    try {
      await createEscrow(token, { propertyId: selectedProperty.id });
      alert("Escrow created!");
      setSelectedProperty(null);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tenant View</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              ${selectedProperty.depositAmount} deposit
            </p>
            <button
              onClick={handleSelectProperty}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 mb-2"
            >
              {loading ? "Creating Escrow..." : "Start Rental Agreement"}
            </button>
            <button
              onClick={() => setSelectedProperty(null)}
              className="w-full text-gray-500 text-sm underline"
            >
              Change Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantView;
