const API_BASE = "http://localhost:4000/api";

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};

export const getProperties = async (token) => {
  const response = await fetch(`${API_BASE}/properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const createProperty = async (token, property) => {
  const response = await fetch(`${API_BASE}/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(property),
  });
  return response.json();
};

export const createEscrow = async (token, escrow) => {
  const response = await fetch(`${API_BASE}/escrows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(escrow),
  });
  return response.json();
};
