import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [isDoctor, setIsDoctor] = useState(false);
  const [isDoctorConfirmed, setIsDoctorConfirmed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDoctor && !isDoctorConfirmed) {
      alert("Please confirm that you are a licensed doctor before signing up.");
      return;
    }

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      isDoctor,
      phoneNumber: isDoctor ? phoneNumber : undefined,
      description: isDoctor ? description : undefined,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(res.data.message);

      // Auto-login for normal users
      if (!isDoctor) {
        login();
        navigate("/content");
      } else {
        navigate("/login"); // Doctors log in after verification
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600">Sign Up</h2>
        <p className="text-center text-gray-500 mt-2">
          Join HealthCheckAI and fight health misinformation
        </p>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-medium transition ${
              !isDoctor
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => {
              setIsDoctor(false);
              setIsDoctorConfirmed(false);
            }}
          >
            Sign Up as User
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isDoctor
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setIsDoctor(true)}
          >
            Sign Up as Doctor
          </button>
        </div>

        {/* Signup Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {isDoctor && (
            <>
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  required={isDoctor}
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Description
                </label>
                <input
                  type="tel"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="In which ur or profession"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  required={isDoctor}
                />
              </div>

              {/* Doctor Confirmation */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="doctorConfirm"
                  checked={isDoctorConfirmed}
                  onChange={(e) => setIsDoctorConfirmed(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="doctorConfirm" className="text-gray-600 text-sm">
                  I confirm that I am a licensed medical practitioner. My account will be reviewed before activation.
                </label>
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-600 font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
          >
            {isDoctor ? "Request Doctor Account" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
