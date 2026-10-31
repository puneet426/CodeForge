import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/code.jpg';
import { MEMBER_COUNT } from '../data/membersStats';

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/communities", label: "Communities" },
  { to: "/events", label: "Events" },
  // Members link shows once src/data/members.js has names in it
  ...(MEMBER_COUNT > 0 ? [{ to: "/members", label: "Members" }] : []),
  { to: "/alumni", label: "Alumni" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact Us" },
];

const linkClass = ({ isActive }) =>
  `relative py-1 transition-colors hover:text-forge-yellow ${isActive ? "text-forge-yellow" : "text-gray-200"}`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 20);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const solid = scrolled || open || pathname !== "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${solid ? "bg-black/85 backdrop-blur-md border-white/10" : "bg-transparent border-transparent"}`}>
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <Link to="/" className="flex items-center" aria-label="Code Forge home">
          <img src={logo} alt="Code Forge Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
        </Link>

        <div className="hidden lg:flex space-x-7 font-mono text-sm">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>{n.label}</NavLink>)}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/leaderboard" className="px-3 md:px-4 py-2 text-xs md:text-sm font-bold text-black bg-forge-yellow rounded hover:bg-orange-400 transition-colors font-mono shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            Leaderboard
          </Link>
          <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded border border-white/15">
            <span className={`block h-0.5 w-5 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <div className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-[32rem]" : "max-h-0"}`}>
        <div className="flex flex-col px-6 pb-6 pt-2 gap-4 font-mono text-base border-t border-white/10">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)} className={linkClass}>{"> "}{n.label}</NavLink>)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
