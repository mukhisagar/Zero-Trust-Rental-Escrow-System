import { useState, useEffect } from "react";
import { getProperties, createProperty } from "../utils/apiAuth";

const LandlordDashboard = ({ token }) => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    depositAmount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [token]);

  const loadProperties = async () => {
    try {
      const data = await getProperties(token);
      setProperties(data);
    } catch (error) {
      alert(error.message);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default LandlordDashboard;
