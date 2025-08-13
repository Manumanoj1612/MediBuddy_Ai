import { Link } from "react-router-dom";

import image from ".././../public/image/image.png";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
      {/* Navbar */}
    

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between flex-1 px-6 lg:px-20 py-12">
        {/* Text */}
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your AI Partner for <span className="text-blue-600">Trusted Health Information</span>
          </h2>
          <p className="text-gray-600 mb-6">
            HealthCheckAI scans articles and social media posts, detecting misleading or harmful
            health information, and provides verified alternatives from trusted sources like WHO and CDC.
          </p>
          <div className="space-x-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="mt-10 lg:mt-0">
          <img
            src={image}
            alt="Health AI"
            className="max-w-lg rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Why misinformation is harmful */}
      <section className="bg-blue-50 py-16 px-6 lg:px-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-10">
          Why Health Misinformation is Harmful
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-blue-600 mb-3">Delays Proper Treatment</h4>
            <p className="text-gray-600">
              False medical advice can cause people to delay seeking the right care, worsening their conditions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-blue-600 mb-3">Spreads Fear & Panic</h4>
            <p className="text-gray-600">
              Misleading information often sparks unnecessary fear, causing mental stress and wrong decisions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-blue-600 mb-3">Damages Public Health</h4>
            <p className="text-gray-600">
              Large-scale misinformation can lead to harmful trends, outbreaks, or resistance to real treatments.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 text-center text-gray-600 text-sm border-t">
        © {new Date().getFullYear()} HealthCheckAI. All rights reserved.
      </footer>
    </div>
  );
}
