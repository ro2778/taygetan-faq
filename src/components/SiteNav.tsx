'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getAllThemes } from '@/lib/faq';

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [themesExpanded, setThemesExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const themes = getAllThemes().filter(t => t.count > 0);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setThemesExpanded(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between px-4 pt-4 pointer-events-none">
      {/* Menu — top left */}
      <div ref={menuRef} className="pointer-events-auto relative">
        <button
          onClick={() => { setMenuOpen(!menuOpen); setLangOpen(false); if (menuOpen) setThemesExpanded(false); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg
                     bg-[rgba(6,6,18,0.4)] border border-white/10
                     hover:bg-[rgba(6,6,18,0.6)] transition-all"
          style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          <svg className="w-5 h-5 text-cosmic-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          <span className="text-sm font-sans text-cosmic-text-dim">Menu</span>
        </button>

        {menuOpen && (
          <div
            className="absolute top-full left-0 mt-2 w-72 rounded-xl overflow-hidden border border-white/10
                       bg-[rgba(6,6,18,0.85)] shadow-2xl"
            style={{ backdropFilter: 'blur(24px) saturate(1.2)', WebkitBackdropFilter: 'blur(24px) saturate(1.2)' }}
          >
            <div className="p-3 space-y-1">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-cosmic-text hover:bg-white/5 transition-colors"
              >
                <svg className="w-4 h-4 text-cosmic-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
                </svg>
                <span className="text-sm font-sans">Home</span>
              </Link>

              {/* Themes — top-level link with expandable submenu */}
              <div>
                <div className="flex items-center">
                  <Link
                    href="/themes"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-l-lg text-cosmic-text hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4 text-cosmic-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-sm font-sans">Themes</span>
                  </Link>
                  <button
                    onClick={() => setThemesExpanded(!themesExpanded)}
                    className="px-3 py-2.5 rounded-r-lg text-cosmic-text-faint hover:bg-white/5 hover:text-cosmic-text-dim transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${themesExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Submenu — individual themes */}
                {themesExpanded && (
                  <div className="ml-10 mt-1 mb-1 space-y-0.5">
                    {themes.map(theme => (
                      <Link
                        key={theme.number}
                        href={`/theme/${theme.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-sans
                                   text-cosmic-text-dim hover:text-cosmic-text hover:bg-white/5 transition-colors"
                      >
                        <span>{theme.number}. {theme.name}</span>
                        <span className="text-xs text-cosmic-text-faint">{theme.count}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* About the Contact */}
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-cosmic-text hover:bg-white/5 transition-colors"
              >
                <svg className="w-4 h-4 text-cosmic-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-sans">About the Contact</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Language selector — top right */}
      <div ref={langRef} className="pointer-events-auto relative">
        <button
          onClick={() => { setLangOpen(!langOpen); setMenuOpen(false); }}
          className="px-3 py-2 rounded-lg text-xs font-sans text-cosmic-text-dim
                     bg-[rgba(6,6,18,0.4)] border border-white/10
                     hover:bg-[rgba(6,6,18,0.6)] transition-all"
          style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          EN
        </button>

        {langOpen && (
          <div
            className="absolute top-full right-0 mt-2 w-40 rounded-xl overflow-hidden border border-white/10
                       bg-[rgba(6,6,18,0.85)] shadow-2xl"
            style={{ backdropFilter: 'blur(24px) saturate(1.2)', WebkitBackdropFilter: 'blur(24px) saturate(1.2)' }}
          >
            <div className="p-2">
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-sans text-cosmic-accent bg-white/5">
                English
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-sans text-cosmic-text-faint cursor-not-allowed opacity-50">
                Español (coming soon)
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm font-sans text-cosmic-text-faint cursor-not-allowed opacity-50">
                Deutsch (coming soon)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
