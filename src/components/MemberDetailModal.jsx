import React from 'react';
import { Modal } from './ui';
import { Avatar } from './PersonCard';

const GitHubIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
);

const LinkedInIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
);

const ensureUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
};

const MemberDetailModal = ({ member, onClose, onEdit, isCurrentUser = false }) => {
  if (!member) return null;

  const stack = Array.isArray(member.stack) 
    ? member.stack 
    : (typeof member.stack === 'string' ? member.stack.split(',').map(s => s.trim()).filter(Boolean) : []);

  const projects = Array.isArray(member.projects) ? member.projects.filter(p => p && p.title && p.title.trim()) : [];

  const githubUrl = member.github_url 
    ? ensureUrl(member.github_url) 
    : (member.github ? `https://github.com/${member.github.replace(/^@/, '')}` : null);

  const linkedinUrl = member.linkedin ? ensureUrl(member.linkedin) : null;
  const websiteUrl = member.website ? ensureUrl(member.website) : null;

  return (
    <Modal onClose={onClose} label={member.name} maxW="max-w-2xl">
      <div className="rounded-2xl border border-forge-yellow/30 bg-[#121212] shadow-[0_0_60px_rgba(249,115,22,0.2)] p-6 md:p-8 font-mono text-white">
        
        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-white/10">
          <Avatar name={member.name} src={member.avatar || member.photo} size="w-20 h-20" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-forge-yellow/10 text-forge-yellow border border-forge-yellow/30">
                {member.role || "Member"}
              </span>
              {member.community && (
                <span className="px-2.5 py-0.5 rounded-full text-xs uppercase bg-white/5 text-gray-400 border border-white/10">
                  {member.community}
                </span>
              )}
              {isCurrentUser && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  You
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                {member.name}
              </h2>

              {isCurrentUser && onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-forge-yellow/50 bg-forge-yellow/10 hover:bg-forge-yellow hover:text-black text-forge-yellow text-xs font-mono font-bold transition-all cursor-pointer shrink-0"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <p className="text-sm text-gray-300 font-sans mt-1">
              {member.branch || "NIAMT"} {member.batch ? `· Batch ${member.batch}` : ""} {member.roll ? `· Roll ${member.roll}` : ""}
            </p>
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <div className="py-5 border-b border-white/10">
            <p className="text-xs text-forge-yellow font-bold uppercase tracking-wider mb-2 font-mono">
              About
            </p>
            <p className="text-gray-300 font-sans text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {member.bio}
            </p>
          </div>
        )}

        {/* Tech Stack */}
        {stack.length > 0 && (
          <div className="py-5 border-b border-white/10">
            <p className="text-xs text-forge-yellow font-bold uppercase tracking-wider mb-3 font-mono">
              Tech Stack & Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {stack.map((t) => (
                <span key={t} className="px-3 py-1 rounded-lg bg-white/5 border border-white/15 text-xs text-gray-200 font-mono">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Featured Projects Showcase */}
        {projects.length > 0 && (
          <div className="py-5 border-b border-white/10">
            <p className="text-xs text-forge-yellow font-bold uppercase tracking-wider mb-4 font-mono">
              Featured Projects ({projects.length})
            </p>
            <div className="space-y-3">
              {projects.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-forge-yellow/40 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-bold text-white font-mono">
                      {p.title}
                    </h4>
                    {p.url && (
                      <a
                        href={ensureUrl(p.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-forge-yellow hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>View Project</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                  {p.desc && (
                    <p className="text-sm text-gray-400 font-sans mt-2 leading-relaxed whitespace-pre-wrap">
                      {p.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social / Connect Footer */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs text-gray-400 font-mono">
              Verified NIAMT Code Forge Member
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-forge-yellow hover:text-black hover:border-forge-yellow text-white text-xs font-mono font-bold transition-all"
              >
                <GitHubIcon className="w-4 h-4" /> GitHub
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-forge-yellow/50 bg-forge-yellow/10 hover:bg-forge-yellow hover:text-black text-forge-yellow text-xs font-mono font-bold transition-all"
              >
                <LinkedInIcon className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/20 bg-white/5 hover:border-white/50 text-gray-300 text-xs font-mono font-bold transition-all"
              >
                Website ↗
              </a>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};

export default MemberDetailModal;