import React, { useState } from 'react';

const ContactSection = () => {
  // 1. State to store input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  // State to show success/error messages
  const [status, setStatus] = useState("");

  // 2. Function to handle typing
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Function to send data to Netlify
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop page from reloading
    setStatus("Sending...");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "contact", // This must match the hidden form name in index.html
        ...formData
      }).toString(),
    })
      .then(() => {
        setStatus("Message Sent! We will get back to you shortly.");
        setFormData({ name: "", email: "", message: "" }); // Clear the form
      })
      .catch((error) => {
        console.error("Form Error:", error);
        setStatus("Error sending message. Please try again.");
      });
  };

  return (
    <section id="contact" className="py-20 px-4 md:px-12 bg-forge-dark border-t border-white/5 font-mono">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT COLUMN: Info & Map */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
              &lt;Get In Touch/&gt;
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Have a question, want to collaborate, or just want to talk code? 
              Drop us a message or find us on campus.
            </p>

            {/* Contact Details */}
            <div className="space-y-6 mb-10">
              <div className="flex items-start space-x-4">
                <div className="bg-forge-yellow/10 p-3 rounded text-forge-yellow">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold">Visit Us</h4>
                  <p className="text-gray-400 text-sm">NIAMT Campus, Ranchi, Jharkhand - 834003</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-forge-yellow/10 p-3 rounded text-forge-yellow">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold">Email Us</h4>
                  <p className="text-gray-400 text-sm">codeforgeniamt@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Embed Google Map */}
            <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(255,215,0,0.1)] grayscale hover:grayscale-0 transition-all duration-500">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.6197481155905!2d85.3071806793457!3d23.293262600000013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f51fcbeaaaaaab%3A0x594cdf25c49ee4f!2sNational%20Institute%20of%20Advanced%20Manufacturing%20Technology%20(Formerly%20NIFFT)!5e0!3m2!1sen!2sin!4v1729083185773!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="NIAMT Map"
              ></iframe>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="bg-black/40 border border-white/10 p-8 rounded-2xl backdrop-blur-sm shadow-2xl relative">
             <div className="absolute top-0 right-0 p-4 opacity-20">
               <svg className="w-24 h-24 text-forge-yellow" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25c-.25-.16-.4-.43-.4-.72 0-.67.73-1.07 1.3-.72L12 11l6.7-4.19c.57-.35 1.3.05 1.3.72 0 .29-.15.56-.4.72z"/></svg>
             </div>
             
             <h3 className="text-2xl font-bold text-white mb-6">Send a Message_</h3>
             
             {/* Added onSubmit handler */}
             <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* REQUIRED: Hidden input for Netlify detection */}
                <input type="hidden" name="form-name" value="contact" />

                <div>
                  <label className="block text-forge-yellow text-sm mb-2 font-bold">&gt; Name</label>
                  <input 
                    type="text" 
                    name="name" // Important: matches state key
                    value={formData.name} // Controlled component
                    onChange={handleChange}
                    required // Makes it mandatory
                    placeholder="Enter your name" 
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-forge-yellow focus:ring-1 focus:ring-forge-yellow transition-colors placeholder-gray-600" 
                  />
                </div>

                <div>
                  <label className="block text-forge-yellow text-sm mb-2 font-bold">&gt; Email </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com" 
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-forge-yellow focus:ring-1 focus:ring-forge-yellow transition-colors placeholder-gray-600" 
                  />
                </div>

                <div>
                  <label className="block text-forge-yellow text-sm mb-2 font-bold">&gt; Message</label>
                  <textarea 
                    rows="4" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Type your message here..." 
                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-forge-yellow focus:ring-1 focus:ring-forge-yellow transition-colors placeholder-gray-600"
                  ></textarea>
                </div>

                {/* Changed type="button" to type="submit" */}
                <button type="submit" className="w-full py-3 bg-forge-yellow text-black font-bold rounded hover:bg-orange-400 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                  [ Submit Message ]
                </button>

                {/* Status Message Display */}
                {status && (
                  <p className={`text-center mt-4 text-sm font-bold ${status.includes("Error") ? "text-red-400" : "text-green-400 animate-pulse"}`}>
                    {status}
                  </p>
                )}
             </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;