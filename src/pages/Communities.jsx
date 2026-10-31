import React from 'react';
import { Link } from 'react-router-dom';

// =========================================
// DATA: Community Information
// =========================================
const communitiesData = [
  {
    id: 1,
    title: "Media Cell & Event Management",
    description: "The creative voice and organizational backbone of Code Forge. This community manages the club's public image, documents events through photography and videography, designs creative assets, and ensures the seamless execution of all club activities and hackathons.",
    activities: [
      "Event Photography, Videography & Editing",
      "Social Media Content Strategy (Reels/Posts)",
      "Graphic Design & Branding Workshops",
      "Event Logistics, Sponsorship & Public Relations"
    ],
    technologies: [
     { name: "Figma/Canva", color: "text-purple-400 border-purple-400" },
    ],
    projects: ["Python Workshop Aftermovie"],
   
    // UPDATED HEADS DATA WITH IMAGES
    heads: [
      { 
        name: "Puneet Tiwari", 
        role: "Media Cell Lead",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1767174524/ptimg2_l4owhq.jpg"
      },
      { 
        name: "Ashutosh Pandey", 
        role: "Event Management Lead",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766576161/WhatsApp_Image_2025-12-24_at_17.04.08_dzoohz.jpg"
      },
      { 
        name: "Agraj Tyagi", 
        role: "Event Management Co-Lead",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1767505022/1709112050641_c0jmcu.jpg"
      },
      { 
        name: "Akash Kumar", 
        role: "Core Team",
        image: "https://media.licdn.com/dms/image/v2/D5603AQGPjpgD0mMbBA/profile-displayphoto-shrink_400_400/B56ZQ3sOhrGoAg-/0/1736101129356?e=1770854400&v=beta&t=TORzJnuU_466BWcnls6PioUS3XGcZvkAlC6fcPWziiI"
      },
      { 
        name: "Wartika Narayan", 
        role: "Core Team",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766567796/WhatsApp_Image_2025-12-24_at_14.45.15_ik6mlw.jpg"
      },
      { 
        name: "Devika Suresh", 
        role: "Core Team",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQG9T2Ct2z5xnw/profile-displayphoto-scale_400_400/B4DZf583cKG8Ag-/0/1752245175403?e=1770854400&v=beta&t=fAuvoSx-Z6tzEKGccsFCahEhaBH6hYmIGe8i2mVouLs"
      },
      { 
        name: "Priya Kumari", 
        role: "Core Team",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1766569060/WhatsApp_Image_2025-12-24_at_15.05.55_zplupp.jpg"
      },
      { 
        name: "Abhishek Kumar", 
        role: "Core Team",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1767505463/WhatsApp_Image_2026-01-03_at_18.23.29_vm5ium.jpg"
      },
    ]
  },
  {
    id: 2,
    title: "Community of Software Development",
    description: "This community is the core engine for building robust, scalable applications. We cover everything from Data Structures & Algorithms (DSA) to full-stack web and mobile development, focusing on clean code and deployment best practices.",
    activities: [
      "5-Day Workshop on Python",
      "10-Day workshop on C Programming",
      "Weekly Competitive Programming Sessions",
      "Full-Stack Development Bootcamps (MERN)",
      "Version Control (Git) workshops",
      "Open Source Contribution drives"
    ],
    technologies: [
      { name: "React/Next.js", color: "text-blue-400 border-blue-400" },
      { name: "Node.js/Express", color: "text-green-400 border-green-400" },
      { name: "MongoDB/PostgreSQL", color: "text-yellow-600 border-yellow-600" },
      { name: "C++ (DSA)", color: "text-purple-400 border-purple-400" }
    ],
    projects: ["Portfolio Website", "Job Portal Clone"],
    // UPDATED HEADS DATA WITH IMAGES
    heads: [
      { 
        name: "Rohit Raj", 
        role: " Lead",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1768989297/WhatsApp_Image_2025-10-30_at_15.38.18_t4q8jo.jpg"
      },
      { 
        name: "Rana Poddar", 
        role: "Co-Lead",
        image: "https://rtime2025.netlify.app/Images/Members/S9.jpg"
      },
      { 
        name: "Prince Kumar", 
        role: "Core Team",
        image: "https://media.licdn.com/dms/image/v2/D5603AQED7tX9tKvTmQ/profile-displayphoto-shrink_400_400/B56ZeHh4EnG0Ak-/0/1750325513885?e=1770854400&v=beta&t=e2c9607V3Ff_c1YcRIy7U73hKtUfZSKWO0GzPxCSHpQ"
      },
      { 
        name: "Md Danish Ali", 
        role: "Core Team",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1767504905/1767194949477_kitajz.jpg"
      }
    ]
  },
  {
    id: 3,
    title: "  Community of Data Science & Artificial Intelligence ",
    description: "This community dives into the world of intelligent systems, teaching the principles of Machine Learning, Deep Learning, and effective Data Analysis to solve complex, real-world predictive and classification problems.",
    activities: [
      "Kaggle Competitions & Workshops",
      "Introduction to Python & Data Science Libraries (Pandas, NumPy)",
      "Deep Learning Frameworks (TensorFlow, PyTorch)",
      "Data Visualization & Storytelling"
    ],
    technologies: [
      { name: "Python", color: "text-yellow-400 border-yellow-400" },
      { name: "TensorFlow/PyTorch", color: "text-orange-400 border-orange-400" },
      { name: "Scikit-learn", color: "text-blue-400 border-blue-400" },
      { name: "Jupyter/Colab", color: "text-green-400 border-green-400" }
    ],
    projects: ["Sentiment Analyzer", "Handwritten Digit Recognizer (CNN)", "Predictive Maintenance Model"],
    heads: [
      { 
        name: "Trishna Verma", 
        role: "Lead ",
        image: "https://rtime2025.netlify.app/Images/Members/S3.png" 
      },
      { 
        name: "Diksha Anand", 
        role: "Co-Lead",
        image: "https://rtime2025.netlify.app/Images/Members/S5.jpg" 
      },
      { 
        name: "Vishal Lodhi", 
        role: "Co-Lead",
        image: null
      },
      { 
        name: "Akash Kumar", 
        role: "Core Team",
        image: "https://media.licdn.com/dms/image/v2/D5603AQGPjpgD0mMbBA/profile-displayphoto-shrink_400_400/B56ZQ3sOhrGoAg-/0/1736101129356?e=1770854400&v=beta&t=TORzJnuU_466BWcnls6PioUS3XGcZvkAlC6fcPWziiI" 
      },
     
      { 
        name: "Abhishek Sinha", 
        role: "Core Team",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1767505141/1766738094366_ryeitj.jpg" 
      }
    ]
  },
  {
    id: 4,
    title: "Community of Cybersecurity & Blockchain",
    description: "A community focused on digital security, exploring how to defend systems from attacks (Cybersecurity) and how to build decentralized, tamper-proof applications (Blockchain/Web3).",
    activities: [
      "5 Day workshop on Cyber Awareness",
      "Network Penetration Testing workshops",
      "Blockchain Fundamentals & Cryptography",
      "Smart Contract Development (Solidity)"
    ],
    technologies: [
      { name: "Kali Linux", color: "text-red-400 border-red-400" },
      { name: "Solidity", color: "text-gray-400 border-gray-400" },
      { name: "Ethereum/Polygon", color: "text-purple-400 border-purple-400" },
      { name: "Networking tools (Wireshark)", color: "text-blue-400 border-blue-400" }
    ],
    projects: ["Decentralized Voting System", "Basic Threat Analysis Tool", "Secure Chat Application Prototype"],
    heads: [
      { 
        name: "Gauri", 
        role: "Lead ",
        image: "https://rtime2025.netlify.app/Images/Members/s10.jpg" 
      },
      { 
        name: "Kundan Saw", 
        role: "Co-Lead",
        image: "https://rtime2025.netlify.app/Images/Members/kundan.jpg" 
      },
      { 
        name: "Damodar Das Chaurasia", 
        role: "Core Team ",
        image: "https://media.licdn.com/dms/image/v2/D5603AQGLCxhOqT8zZw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1725464826423?e=1770854400&v=beta&t=2aKr3bw5PV6ptA2JIpTMrQoBTO1reDxj7b35_PINL1s" 
      },
      { 
        name: "Anubhav Dubey", 
        role: "Core Team ",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1767504784/WhatsApp_Image_2026-01-04_at_07.44.34_qwiqs3.jpg" 
      },
      
    ]
  },
  {
    id: 5,
    title: "Community of Electronics & Automation",
    description: "Bridging the physical and digital worlds, this community focuses on Internet of Things (IoT), Robotics, and industrial automation using microcontrollers, sensors, and actuator systems.",
    activities: [
      "IoT Sensor Interfacing Workshops (Arduino/ESP32)",
      "Robotics and Mechanism Design",
      "Embedded C/C++ Programming",
      "Home Automation and Smart Systems projects"
    ],
    technologies: [
      { name: "Arduino/Raspberry Pi", color: "text-teal-400 border-teal-400" },
      { name: "Embedded C", color: "text-blue-400 border-blue-400" },
      { name: "IoT Platforms (Firebase/Adafruit)", color: "text-orange-400 border-orange-400" },
      { name: "Circuit Design", color: "text-yellow-400 border-yellow-400" }
    ],
    projects: ["Smart Attendance System (RFID)", "Autonomous Line Follower Robot", "Weather Station using ESP32"],
    heads: [
      { 
        name: "Siddharthaa Srivastava", 
        role: "Lead ",
        image: "https://rtime2025.netlify.app/Images/Members/S6.jpg" 
      },
      { 
        name: "Pawan Kumar", 
        role: "Co-Lead ",
        image: "https://res.cloudinary.com/dp7clwitm/image/upload/v1767504856/WhatsApp_Image_2026-01-03_at_20.40.36_lqlwvy.jpg" 
      },
      { 
        name: "Kumar Sushant Raj", 
        role: "Core Team ",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQHb1O29XbdY0Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1726283470624?e=1770854400&v=beta&t=nr75yReP1zqsvXWCsClCPY5Bgjw0rQ6DlSwkXeDCVKk" 
      },
      { 
        name: "Phulkeshwar Mahto", 
        role: "Core Team",
        image: "https://media.licdn.com/dms/image/v2/D4E03AQHupau3fouZhw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725889078884?e=1770854400&v=beta&t=8-Ol727LQXi-iLfeYdTz97ZwUkiZXmYcYn8WKMxCEzE" 
      },
      
    ]
  }
];

// =========================================
// COMPONENT: Single Community Card
// =========================================
const CommunityCard = ({ community }) => {
  return (
    <section className="mb-16 p-8 border border-white/10 bg-black/40 rounded-2xl backdrop-blur-sm hover:border-forge-yellow/50 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.3)]">
      {/* Title */}
      <h3 className="text-3xl md:text-4xl font-black text-forge-yellow  mb-6 flex items-center border-b border-white/10 pb-4">
        <span className="mr-4 opacity-50 text-2xl font-mono">{community.id.toString().padStart(2, '0')}.</span> {community.title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 mb-8 text-lg leading-relaxed font-sans">
        {community.description}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Left Column: Activities */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider flex items-center">
            <span className="text-forge-yellow mr-2"></span> Activities & Focus
          </h3>
          <ul className="space-y-3 text-gray-400 font-sans">
            {community.activities.map((activity, index) => (
              <li key={index} className="flex items-start">
                 <span className="text-forge-yellow/70 mr-2 mt-1">▪</span> {activity}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Tech & Projects */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider flex items-center">
             <span className="text-forge-yellow mr-2"></span> Core Stack
          </h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {community.technologies.map((tech, index) => (
              <span key={index} className={`px-3 py-1 text-sm font-mono border rounded-full bg-black/50 backdrop-blur-md shadow-sm ${tech.color}`}>
                {tech.name}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider flex items-center">
             <span className="text-forge-yellow mr-2"></span> Projects Highlight
          </h3>
          <div className="text-gray-400 font-sans space-y-2">
            {community.projects.map((project, index) => (
              <div key={index} className="flex items-center">
                <svg className="w-4 h-4 text-forge-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {project}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Heads - UPDATED UI FOR PHOTOS */}
      <div className="border-t border-white/10 pt-8">
        <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-wider text-center">
           <span className="text-forge-yellow"></span> Community Heads
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {community.heads.map((head, index) => (
            <div key={index} className="p-4 border border-white/5 bg-white/5 rounded-xl text-center flex flex-col items-center group hover:border-forge-yellow/40 hover:bg-black/60 transition-all duration-300">
              
              {/* UPDATED: Image Container */}
              <div className="w-20 h-20 mb-4 rounded-full border-2 border-forge-yellow/30 p-0.5 group-hover:border-forge-yellow transition-all group-hover:shadow-[0_0_10px_rgba(255,215,0,0.4)]">
                <img 
                  src={head.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(head.name)}&backgroundColor=1a1a1a&textColor=f97316`} 
                  alt={head.name} 
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(head.name)}&backgroundColor=1a1a1a&textColor=f97316`; }}
                  className="w-full h-full rounded-full object-cover  group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              
              <h4 className="text-lg font-bold text-white group-hover:text-forge-yellow transition-colors">{head.name}</h4>
              <p className="text-xs text-gray-400 font-mono uppercase mt-1">{head.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =========================================
// MAIN COMPONENT: Communities Page
// =========================================
const Communities = () => {
  return (
    <div className="min-h-screen bg-forge-dark bg-dot-pattern pt-28 pb-12 px-4 md:px-12 font-mono text-white">
      
      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-block px-3 py-1 mb-4 border border-forge-yellow rounded-full bg-forge-yellow/10 text-forge-yellow text-sm font-bold tracking-widest">
            DOMAINS & SPECIALIZATIONS
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white  mb-6">
          &lt;Our Communities&gt;
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-sans">
          Discover your passion, build your skills, and lead the future in one of our specialized technical domains.
        </p>
      </div>

      {/* Communities List */}
      <div className="max-w-6xl mx-auto">
        {communitiesData.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>

      {/* Back to Home Link */}
      

    </div>
  );
};

export default Communities;