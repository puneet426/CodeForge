import React from 'react';

const initials = (name) =>
  name.replace(/[^A-Za-z\s]/g, " ").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";

// Deterministic warm hue per name so avatars look varied but on-brand.
const hue = (name) => {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return 15 + (h % 30); // orange–amber range
};

export const Avatar = ({ name, src, size = "w-14 h-14" }) => (
  <div className={`${size} shrink-0 rounded-full p-0.5 bg-gradient-to-br from-forge-yellow/80 to-forge-yellow/10`}>
    {src ? (
      <img src={src} alt={name} loading="lazy" className="w-full h-full rounded-full object-cover bg-black" />
    ) : (
      <div className="w-full h-full rounded-full flex items-center justify-center font-mono font-black text-lg text-white"
        style={{ background: `linear-gradient(135deg, hsl(${hue(name)} 70% 22%), #0a0a0a)` }}>
        {initials(name)}
      </div>
    )}
  </div>
);

const LinkedInIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
);
const GitHubIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
);

// Card for an alumnus or a member. Shows a "Connect" button when a LinkedIn link exists.
// Self-registered members can also pass bio, stack (array) and projects.
const PersonCard = ({ name, line1, line2, chip, linkedin, github, avatar, bio, stack = [], projects = [] }) => (
  <div className="group h-full flex flex-col rounded-2xl border border-white/10 bg-black/50 p-5 hover:border-forge-yellow/60 hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex items-start gap-4">
      <Avatar name={name} src={avatar} />
      <div className="min-w-0">
        <h3 className="text-white font-bold leading-snug group-hover:text-forge-yellow transition-colors">{name}</h3>
        {line1 && <p className="text-sm text-gray-300 mt-0.5 font-sans leading-snug">{line1}</p>}
        {line2 && <p className="text-xs text-forge-yellow font-mono mt-1">{line2}</p>}
      </div>
    </div>
    {bio && <p className="mt-3 text-sm text-gray-400 font-sans leading-relaxed line-clamp-3">{bio}</p>}
    {stack.length > 0 && (
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tech stack">
        {stack.slice(0, 6).map((t) => (
          <li key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300">{t}</li>
        ))}
      </ul>
    )}
    {projects.length > 0 && (
      <ul className="mt-3 space-y-1.5" aria-label="Projects">
        {projects.map((p) => (
          <li key={p.title} className="text-xs font-sans leading-snug">
            {p.url
              ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-white hover:text-forge-yellow transition-colors">{p.title} ↗</a>
              : <span className="font-mono font-bold text-white">{p.title}</span>}
            {p.desc && <span className="text-gray-500"> — {p.desc}</span>}
          </li>
        ))}
      </ul>
    )}
    <div className="mt-auto pt-4 flex items-center justify-between gap-2">
      {chip ? <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 truncate">{chip}</span> : <span />}
      <div className="flex items-center gap-2">
        {github && (
          <a href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer" aria-label={`${name} on GitHub`}
            className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-gray-300 hover:text-black hover:bg-forge-yellow hover:border-forge-yellow transition-colors">
            <GitHubIcon className="w-4 h-4" />
          </a>
        )}
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`Connect with ${name} on LinkedIn`}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-forge-yellow/50 text-forge-yellow text-xs font-mono font-bold hover:bg-forge-yellow hover:text-black transition-colors">
            <LinkedInIcon className="w-3.5 h-3.5" /> Connect
          </a>
        )}
      </div>
    </div>
  </div>
);

export default PersonCard;
