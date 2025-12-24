import React from 'react';
import { Link } from 'react-router-dom';

// =========================================
// DATA: Guidelines Content
// =========================================
const guidelinesData = [
  {
    id: "01",
    title: "General Code of Conduct",
    icon: "⚖️",
    rules: [
      "Respect is non-negotiable. Treat all members, faculty, and guests with dignity regardless of their skill level.",
      "Foster an inclusive environment. Harassment, discrimination, or bullying of any kind will result in immediate expulsion.",
      "Collaboration over competition. Help your peers debug, learn, and grow.",
      "Keep discussions professional. The official communication channels (Discord/WhatsApp) are for tech and club updates only."
    ]
  },
  {
    id: "02",
    title: "Lab & Hardware Protocols",
    icon: "🖥️",
    rules: [
      "No food or drinks inside the Computer Center or Club Labs. Hydration breaks must be taken outside.",
      "Hardware care is critical. Do not mishandle keyboards, mice, or IoT components. Report malfunctions immediately.",
      "Log out after use. Ensure your workstation is signed out and the chair is pushed back in before leaving.",
      "Do not install unauthorized software or modify system settings on college machines."
    ]
  },
  {
    id: "03",
    title: "Academic Integrity & Plagiarism",
    icon: "🛡️",
    rules: [
      "Zero tolerance for plagiarism. In Hackathons and projects, copy-pasting code without understanding or attribution is banned.",
      "Credit where credit is due. If you use open-source libraries or snippets, cite the original author or documentation.",
      "Do not share solutions during competitive programming contests unless the contest is officially over."
    ]
  },
  {
    id: "04",
    title: "Contribution & Development",
    icon: "🐙",
    rules: [
      "Follow the Git Workflow. Do not push directly to the 'main' branch. Use Pull Requests (PRs) for all changes.",
      "Write clean, documented code. Comments are not optional; they are a requirement for merging.",
      "Respect project deadlines. If you are assigned a task, communicate early if you cannot complete it on time."
    ]
  }
];

// =========================================
// COMPONENT: Guidelines Page
// =========================================
const Guidelines = () => {
  return (
    <div className="min-h-screen bg-forge-dark bg-dot-pattern pt-28 pb-12 px-4 md:px-12 font-mono text-white">
      
      {/* 1. Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-block px-3 py-1 mb-4 border border-forge-yellow rounded-full bg-forge-yellow/10 text-forge-yellow text-sm font-bold tracking-widest animate-pulse">
          COMMUNITY_PROTOCOLS
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white  mb-6">
          &lt;Community Guidelines&gt;
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          To maintain order in the system, all nodes must adhere to the following protocols. Ignorance of the rules is not a patch for misconduct.
        </p>
      </div>

      {/* 2. Guidelines Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {guidelinesData.map((section) => (
          <div key={section.id} className="bg-black/40 border border-white/10 p-8 rounded-xl backdrop-blur-sm hover:border-forge-yellow/50 transition-all hover:-translate-y-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="text-forge-yellow mr-3 text-3xl">{section.icon}</span>
                {section.title}
              </h2>
              <span className="text-4xl font-black text-white/5">{section.id}</span>
            </div>

            <ul className="space-y-4">
              {section.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start text-gray-300">
                  <span className="text-forge-yellow mr-3 mt-1"></span>
                  <span className="text-sm md:text-base leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>

          </div>
        ))}
      </div>

      {/* 3. Disciplinary Action "Terminal" */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="bg-black border border-red-500/30 rounded-lg p-6 font-mono text-sm shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <div className="flex space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-red-400 mb-2">Disciplinary_action</p>
          <p className="text-gray-300 mb-4">
            WARNING: Violation of these guidelines may result in:
          </p>
          <ul className="list-none space-y-1 text-gray-400 pl-4 border-l-2 border-red-500/50">
            <li>[1] Verbal Warning (First Offense)</li>
            <li>[2] Suspension from Club Activities/Lab Access</li>
            <li>[3] Permanent Ban & Report to Institute Administration</li>
          </ul>
          <p className="text-red-400 mt-4 animate-pulse">_</p>
        </div>
      </div>

      {/* 4. Navigation Footer */}
      <div className="text-center border-t border-white/10 pt-12">
        <p className="text-gray-500 mb-6">By joining Code Forge, you agree to these terms.</p>
        <Link to="/">
          <button className="px-8 py-3 text-sm font-bold text-black bg-forge-yellow rounded hover:bg-yellow-400 transition-colors font-mono shadow-[0_0_15px_rgba(255,215,0,0.4)]">
            [ I Agree & Return Home ]
          </button>
        </Link>
      </div>

    </div>
  );
};

export default Guidelines;