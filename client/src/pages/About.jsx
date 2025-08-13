// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen py-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center">
        {/* Left Content */}
        <div>
          <h2 className="text-4xl font-bold mb-6 text-blue-600">
            About Medi-BuddyAi
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            <strong>Medi-BuddyAi</strong> is an AI-powered platform designed to
            help you detect, analyze, and flag misleading or harmful health
            information across the web. In an age where misinformation spreads
            faster than facts, we provide an intelligent solution to ensure you
            only consume reliable and safe health content.
          </p>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Our system scans health-related articles, posts, and web content,
            then cross-verifies claims with trusted medical sources like{" "}
            <span className="font-medium">WHO, CDC, and PubMed</span>.
            Users receive real-time alerts and suggestions for verified
            alternatives, empowering them to make informed health decisions.
          </p>
          <h3 className="text-2xl font-semibold mt-6 mb-2">
            Key Features:
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Real-time content scanning & misinformation detection</li>
            <li>Cross-verification with verified medical databases</li>
            <li>Browser extension & API integration for easy access</li>
            <li>User-friendly dashboard for tracking alerts</li>
            <li>Personalized recommendations for safer health resources</li>
          </ul>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Our mission is to create a healthier digital space by promoting
            accurate health information and preventing the spread of
            misinformation — one click at a time.
          </p>
        </div>

        {/* Right Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1581091012184-5c4a9d5b1d8a"
            alt="AI Health Analysis"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
