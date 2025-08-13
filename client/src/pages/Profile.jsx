// src/component/profile/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Helper to create initials from name
function generateAvatar(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md text-center">
      <div
        className="mx-auto mb-4 flex items-center justify-center w-24 h-24 rounded-full bg-blue-600 text-white text-5xl font-bold"
        title={user.name}
      >
        {generateAvatar(user.name)}
      </div>
      <h2 className="text-2xl font-semibold">{user.name}</h2>
      <p className="text-gray-600 mb-6">{user.email}</p>

      <button
        onClick={logout}
        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
