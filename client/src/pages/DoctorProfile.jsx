import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorProfiles() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleContact = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Verified Doctors
      </h1>

      {doctors.length === 0 ? (
        <p className="text-center text-gray-500">
          No verified doctors available yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white shadow-lg rounded-xl p-5 text-center border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {doctor.name}
              </h2>
              <p className="text-gray-600">{doctor.email}</p>
              {doctor.description && (
                <p className="mt-2 text-gray-700 italic">
                  {doctor.description}
                </p>
              )}
              <button
                onClick={() => handleContact(doctor.email)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Contact Doctor
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
