import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import logo from '../assets/code.jpg'

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/10">
      
      {/* Logo links to Home */}
      <Link to="/" className="flex items-center">
        <img 
          src={logo} 
          alt="Code Forge Logo" 
          className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" 
        />
      </Link>

      <div className="hidden md:flex space-x-8 font-mono text-sm">
        {/* 2. Use Link instead of a href */}
        <Link to="/" className="hover:text-forge-yellow transition-colors">Home</Link>
        <Link to="/about" className="hover:text-forge-yellow transition-colors">About</Link>
        <Link to ="/communities" className="hover:text-forge-yellow transition-colors">Communities</Link>
        <Link to="/events" className="hover:text-forge-yellow transition-colors">Events</Link>
        <Link to="/contact" className="hover:text-forge-yellow transition-colors">Contact US</Link>
        <Link to="/Leaderboard" className="hover:text-forge-yellow transition-colors">Leaderboard</Link>
      </div>

      <div>
        <a href='https://chat.whatsapp.com/BlBNJT7f9XqC7s23myGI5k' className="px-4 py-2 text-sm font-bold text-black bg-forge-yellow rounded hover:bg-orange-400 transition-colors font-mono cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.4)]">
          Join Club
        </a>
      </div>
    </nav>
  );
};

export default Navbar;