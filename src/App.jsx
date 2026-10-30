import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import About from './pages/About';
import Communities from './pages/Communities';
import EventsSection from './pages/EventsSection';
import Leaderboard from './pages/Leaderboard';
import Gallery from './pages/Gallery';
import Footer from './components/Footer';
import Guidelines from './pages/Guidelines';
import ContactSection from './pages/ContactSection';

// Scroll to top on page change (or to the #hash target if there is one).
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollManager />
      <div className="antialiased bg-forge-dark min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/about" element={<About />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/events" element={<EventsSection />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<div className="pt-16"><ContactSection /></div>} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
