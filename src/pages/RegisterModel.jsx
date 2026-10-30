import React, { useState } from 'react';

const RegisterModal = ({ eventName, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    year: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Registering...");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "event-registration",
        "eventName": eventName,
        ...formData
      }).toString(),
    })
    .then(() => {
      setStatus("Registration Successful! Redirecting...");
      setTimeout(() => {
        onClose(); 
        setStatus(""); 
      }, 2000);
    })
    .catch(() => setStatus("Error. Please try again."));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-forge-dark border border-forge-yellow/50 rounded-xl p-8 max-w-md w-full relative shadow-[0_0_30px_rgba(255,215,0,0.2)]">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Register Event</h2>
        <p className="text-forge-yellow font-mono text-sm mb-6"> {eventName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="form-name" value="event-registration" />
            <input type="hidden" name="eventName" value={eventName} />

            <div>
              <input type="text" name="name" required placeholder="Full Name" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-forge-yellow outline-none transition-colors" />
            </div>
            
            <div>
              <input type="email" name="email" required placeholder="College Email" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-forge-yellow outline-none transition-colors" />
            </div>

            <div>
              <input type="text" name="phone" required placeholder="WhatsApp Number" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-forge-yellow outline-none transition-colors" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <input type="text" name="branch" required placeholder="Branch" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-forge-yellow outline-none transition-colors" />
                <input type="text" name="year" required placeholder="Year" onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-forge-yellow outline-none transition-colors" />
            </div>

            <button type="submit" className="w-full py-3 mt-4 bg-forge-yellow text-black font-bold rounded hover:bg-orange-400 transition-colors shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                [ Confirm Registration ]
            </button>

            {status && (
              <p className={`text-center text-sm mt-4 font-bold ${status.includes("Error") ? "text-red-500" : "text-green-400"}`}>
                {status}
              </p>
            )}
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;