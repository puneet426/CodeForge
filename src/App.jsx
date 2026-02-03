import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import About from './pages/About';
import Communities from './pages/Communities'; // 1. Import the new page
import EventsSection from './pages/EventsSection';
import Leaderboard from './pages/Leaderboard';

import Footer from './components/Footer';
import Guidelines from './pages/Guidelines';
import ContactSection from './pages/ContactSection';

function App() {
  return (
    <Router>
      <div className="antialiased bg-forge-dark min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/about" element={<About />} />
          {/* 2. Add the new route */}
          <Route path="/communities" element={<Communities />} />
          <Route path="/events" element={<EventsSection/>} />
          <Route path="/contact" element={<ContactSection/>} />
          <Route path="/guidelines" element={<Guidelines/>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
        </Routes>
        
        <Footer/>
      </div>
    </Router>
  );
}

export default App;