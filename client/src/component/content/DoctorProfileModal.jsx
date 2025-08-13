import React, { useState } from "react";

export default function DoctorProfileModal({ isOpen, onClose, summary, doctorInfo, doctors, onDoctorChange }) {
  const [emailSubject, setEmailSubject] = useState("Health Consultation Request");
  const [emailBody, setEmailBody] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(0);

  if (!isOpen) return null;

  const handleContact = () => {
    const fullEmailBody = `${emailBody}\n\n--- Chat Summary ---\n${summary}`;
    const mailtoLink = `mailto:${doctorInfo.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(fullEmailBody)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Doctor Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Doctor Selection */}
        {doctors && doctors.length > 0 ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Doctor
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => {
                const index = parseInt(e.target.value);
                setSelectedDoctorId(index);
                if (onDoctorChange && doctors[index]) {
                  onDoctorChange(doctors[index]);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {doctors.map((doctor, index) => (
                <option key={doctor._id || index} value={index}>
                  {doctor.name} - {doctor.description || "General Physician"}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              No doctors available. Using default doctor profile.
            </p>
          </div>
        )}

        {/* Doctor Information */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl text-green-600 font-bold">
                {doctorInfo.name?.charAt(0) || "D"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{doctorInfo.name || "Dr. John Doe"}</h3>
              <p className="text-green-600 font-medium">{doctorInfo.specialization || "General Physician"}</p>
              <p className="text-gray-600">{doctorInfo.hospital || "City General Hospital"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium">{doctorInfo.experience || "15+ years"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Languages</p>
              <p className="font-medium">{doctorInfo.languages || "English, Hindi"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultation Fee</p>
              <p className="font-medium">{doctorInfo.fee || "$50"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <p className="font-medium">{doctorInfo.rating || "4.8"} ⭐</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">About</p>
            <p className="text-gray-700">
              {doctorInfo.about || "Experienced physician with expertise in preventive care, chronic disease management, and patient education. Committed to providing personalized healthcare solutions."}
            </p>
          </div>
        </div>

        {/* Chat Summary Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-800">Chat Summary</h4>
            {summary ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Generated Successfully
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                No Summary Available
              </span>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            {summary ? (
              <p className="text-gray-700 text-sm">{summary}</p>
            ) : (
              <p className="text-gray-500 text-sm italic">No chat summary available. Please generate a summary first.</p>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Contact Doctor</h4>
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> The chat summary will be automatically added to your email when you click "Contact Doctor".
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (Summary will be automatically added)
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows="4"
                placeholder="Write your message here..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleContact}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold"
          >
            Contact Doctor
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
