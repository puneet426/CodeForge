import React from 'react';

// Data for leadership to make rendering easier
const leadershipData = [
    {
    name: "Dr. Madhu Kumari",
    role: "Chairperson",
    image: "https://rtime2025.netlify.app/Images/HOD.jpg",
  },
  {
    name: "Dr. Rahul Mishra",
    role: "Faculty Advisor",
    // Using a placeholder image service that matches the theme colors.
    // Replace these src URLs with actual photo imports later.
    image: "https://scholar.googleusercontent.com/citations?view_op=medium_photo&user=5KwWYyIAAAAJ&citpid=1",
  },
  {
    name: "Dr. Ravinder Pal Singh",
    role: "Faculty Advisor",
    image: "https://rtime2025.netlify.app/Images/1.jpg",
  },
  {
    name: "Dr. Shalini Mahato",
    role: "Faculty Advisor",
    image: "https://rtime2025.netlify.app/Images/30.png",
  },
  {
    name: "Dr. Dinesh Kumar Prabhakar",
    role: "Faculty Advisor",
    image: "https://rtime2025.netlify.app/Images/dkp.jpg",
  },
  {
    name: "Mr. Abhishek Bakhla",
    role: "Faculty Advisor",
    image: "https://rtime2025.netlify.app/Images/4.jpeg",
  },

];

const About = () => {
  return (
    <div className="min-h-screen bg-forge-dark bg-dot-pattern pt-24 pb-12 px-4 md:px-12 font-mono text-white">
      
      {/* 1. Header Section (Unchanged) */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-forge-yellow  mb-6">
          &lt;About Us/&gt;
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
          "Learn • Build • Lead — Creating a strong coding culture on campus."
        </p>
        <p className="mt-4 text-gray-400">
          Official Coding Club of NIAMT, Ranchi. Established 2024.
        </p>
      </div>

      {/* 2. Impact Stats Grid (Unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
        {[
          { label: "Students Trained", val: "100+" },
          { label: "Workshops Conducted", val: "10+" },
          { label: "Projects Built", val: "50+" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-black/50 border border-forge-yellow/30 p-6 rounded-lg text-center backdrop-blur-sm shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:scale-105 transition-transform">
            <h3 className="text-4xl font-bold text-forge-yellow mb-2">{stat.val}</h3>
            <p className="text-gray-400 uppercase tracking-widest text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 3. Communities Section (Unchanged) */}
      

      {/* 4. UPDATED Leadership Section */}
      <div className="max-w-5xl mx-auto text-center mb-20">
         <h2 className="text-3xl font-bold text-white mb-12 border-b border-gray-700 pb-4 inline-block">
          <span className="text-forge-yellow"></span> Advisors
        </h2>
        
        {/* Grid layout for leaders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
           {leadershipData.map((leader, index) => (
             <div key={index} className="group p-6 border border-white/10 rounded-xl bg-black/40 flex flex-col items-center text-center hover:border-forge-yellow/50 transition-all hover:-translate-y-1">
                
                {/* 1. Photo (Circular with glow border) */}
                <div className="mb-6 relative">
                  <div className="w-32 h-32 rounded-full border-2 border-forge-yellow/50 p-1 group-hover:border-forge-yellow transition-colors group-hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                    <img 
                      src={leader.image} 
                      alt={leader.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* 2. Designation (Yellow, smaller, uppercase) */}
                <p className="text-forge-yellow text-sm font-bold uppercase tracking-wider mb-3">
                  {leader.role}
                </p>

                {/* 3. Name (White, larger) */}
                <h4 className="text-2xl font-bold text-white group-hover:text-forge-yellow transition-colors">
                  {leader.name}
                </h4>

             </div>
           ))}
        </div>
      </div>

    </div>
  );
};

export default About;