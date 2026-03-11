'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { getAllAnswers } from '@/lib/faq';
import { basePath } from '@/lib/basePath';
import type { FAQAnswer } from '@/lib/types';

export default function HomePage() {
  const allAnswers = getAllAnswers();

  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        document.activeElement !== mobileInputRef.current &&
        document.activeElement !== desktopInputRef.current
      ) {
        e.preventDefault();
        // Focus whichever input is visible
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
          mobileInputRef.current?.focus();
        } else {
          desktopInputRef.current?.focus();
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Fuse.js search index
  const fuse = useMemo(
    () =>
      new Fuse(allAnswers, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'excerpt', weight: 1 },
          { name: 'themeName', weight: 0.5 },
          { name: 'speakers', weight: 0.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [allAnswers]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    return fuse.search(search).map(r => r.item);
  }, [search, fuse]);

  const glassActive = searchFocused || search.length > 0;
  const hasResults = search.trim().length > 0;
  const showingResults = hasResults && filtered.length > 0;
  const topResults = filtered.slice(0, 8);
  const moreCount = filtered.length > 8 ? filtered.length - 8 : 0;

  // --- Search box inner content (shared styling, different refs) ---
  const searchBoxInner = (ref: React.RefObject<HTMLInputElement | null>) => (
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-500 ${
        glassActive
          ? 'bg-[rgba(6,6,18,0.55)] border-white/15 shadow-[0_0_30px_rgba(212,113,58,0.12)]'
          : 'bg-[rgba(6,6,18,0.35)] border-white/10'
      }`}
      style={{
        backdropFilter: 'blur(16px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.1)',
      }}
    >
      <svg
        className="w-5 h-5 flex-shrink-0 text-cosmic-accent/60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" strokeWidth={2} />
        <path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
      </svg>
      <input
        ref={ref}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        placeholder="Search the Taygetan contact..."
        className="flex-1 bg-transparent text-cosmic-text placeholder-cosmic-text-faint
                   font-sans text-base focus:outline-none"
      />
      {hasResults && (
        <span
          className="text-xs font-sans tabular-nums transition-opacity duration-300 flex-shrink-0"
          style={{ color: 'rgba(212,113,58,0.55)' }}
        >
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </span>
      )}
      {search && (
        <button
          onClick={() => setSearch('')}
          className="text-cosmic-text-dim hover:text-cosmic-text transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );

  // --- Etheric result item ---
  const resultItem = (answer: FAQAnswer, i: number) => (
    <Link
      key={answer.slug}
      href={`/answer/${answer.slug}`}
      className="group block px-4 py-3 rounded-xl transition-all duration-300
                 hover:bg-[rgba(212,113,58,0.08)]"
      style={{ animationDelay: `${i * 60}ms` }}
    >
      <p
        className="text-sm font-serif leading-snug transition-colors duration-300
                   group-hover:text-[#ffe8cc]"
        style={{
          color: 'rgba(232,224,208,0.75)',
          textShadow: '0 1px 8px rgba(0,0,0,0.6)',
        }}
      >
        {answer.title}
      </p>
      <p
        className="text-xs font-sans mt-0.5 transition-colors duration-300
                   group-hover:text-cosmic-accent/60"
        style={{ color: 'rgba(212,113,58,0.4)' }}
      >
        {answer.themeName}
      </p>
    </Link>
  );

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${basePath}/images/hero-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
      }}
    >
      {/* Glass overlay */}
      <div
        className={`fixed inset-0 transition-all duration-700 ease-out pointer-events-none ${
          glassActive
            ? 'bg-[rgba(6,6,18,0.45)] backdrop-blur-[12px]'
            : 'bg-transparent backdrop-blur-0'
        }`}
        style={{ WebkitBackdropFilter: glassActive ? 'blur(12px) saturate(1.1)' : 'none' }}
      />

      {/* ============================
          SMALL SCREENS (< lg / 1024px)
          Single DOM structure — search transitions from centre to top via padding.
          Title fades out, results fade in. No re-mount = no focus loss.
          ============================ */}
      <div className="lg:hidden relative z-10 min-h-screen flex flex-col px-5">
        {/* Search box — always rendered, transitions its top padding */}
        <div
          className="w-full max-w-xl mx-auto transition-all duration-500 ease-out"
          style={{ paddingTop: showingResults ? '4rem' : '35vh' }}
        >
          {searchBoxInner(mobileInputRef)}
        </div>

        {/* Title — smoothly collapses and fades when searching */}
        <div
          className={`text-center mx-auto transition-all duration-500 ease-out overflow-hidden
                      ${showingResults
                        ? 'opacity-0 max-h-0 mt-0'
                        : 'opacity-100 max-h-24 mt-8'}`}
        >
          <h1
            className="text-3xl sm:text-4xl font-serif font-light tracking-[6px] sm:tracking-[8px] mb-1"
            style={{
              color: '#ffe8cc',
              textShadow: '0 0 60px rgba(212,113,58,0.4), 0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            COSMIC AGENCY
          </h1>
          <p
            className="text-xs font-sans font-medium tracking-[3px]"
            style={{
              color: 'rgba(232,224,208,0.6)',
              textShadow: '0 1px 8px rgba(0,0,0,0.8)',
            }}
          >
            KNOWLEDGE FROM THE STARS
          </p>
        </div>

        {/* No results message */}
        {hasResults && filtered.length === 0 && (
          <p
            className="text-center mt-6 text-sm font-sans"
            style={{ color: 'rgba(232,224,208,0.45)' }}
          >
            No transcripts found for &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Results — fade in below the search box */}
        <div
          className={`flex-1 mt-4 overflow-y-auto transition-all duration-500 ease-out
                      ${showingResults
                        ? 'opacity-100'
                        : 'opacity-0 pointer-events-none h-0'}`}
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="max-w-xl mx-auto space-y-1 pb-8">
            {topResults.map((answer, i) => resultItem(answer, i))}
            {moreCount > 0 && (
              <p
                className="px-4 py-2 text-xs font-sans"
                style={{ color: 'rgba(232,224,208,0.35)' }}
              >
                + {moreCount} more results
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ============================
          LARGE SCREENS (>= lg / 1024px)
          Side-by-side: results left, search centre-right
          ============================ */}
      <div className="hidden lg:block relative z-10 min-h-screen">
        <div className="flex items-center justify-center min-h-screen">

          {/* Etheric results — float to the left */}
          <div
            className={`absolute left-12 xl:left-16 top-1/2 -translate-y-1/2
                        max-w-sm w-full transition-all duration-500 ease-out
                        max-h-[70vh] overflow-y-auto
                        ${showingResults
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-8 pointer-events-none'}`}
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="space-y-1">
              {topResults.map((answer, i) => resultItem(answer, i))}
              {moreCount > 0 && (
                <p
                  className="px-4 py-2 text-xs font-sans"
                  style={{ color: 'rgba(232,224,208,0.35)' }}
                >
                  + {moreCount} more results
                </p>
              )}
            </div>
          </div>

          {/* Search + Title — centred, shifts right when results show */}
          <div
            className={`flex flex-col items-center w-full max-w-xl transition-all duration-700 ease-out
                        ${showingResults
                          ? 'lg:translate-x-[12%] xl:translate-x-[18%]'
                          : 'translate-x-0'}`}
          >
            {/* Search box */}
            <div className="w-full mb-10 animate-fade-up">
              {searchBoxInner(desktopInputRef)}
            </div>

            {/* Title — fades when results show */}
            <div
              className={`text-center animate-fade-up transition-opacity duration-500
                          ${showingResults ? 'opacity-40' : 'opacity-100'}`}
              style={{ animationDelay: '0.15s' }}
            >
              <h1
                className="text-4xl xl:text-5xl font-serif font-light tracking-[8px] mb-1"
                style={{
                  color: '#ffe8cc',
                  textShadow: '0 0 60px rgba(212,113,58,0.4), 0 2px 20px rgba(0,0,0,0.5)',
                }}
              >
                COSMIC AGENCY
              </h1>
              <p
                className="text-xs font-sans font-medium tracking-[3px]"
                style={{
                  color: 'rgba(232,224,208,0.6)',
                  textShadow: '0 1px 8px rgba(0,0,0,0.8)',
                }}
              >
                KNOWLEDGE FROM THE STARS
              </p>
            </div>

            {/* No results message */}
            {hasResults && filtered.length === 0 && (
              <p
                className="mt-6 text-sm font-sans transition-opacity duration-300"
                style={{ color: 'rgba(232,224,208,0.45)' }}
              >
                No transcripts found for &ldquo;{search}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
