'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search questions…',
  resultCount,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: / to focus
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-text-dim"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-16 py-4 bg-cosmic-surface border border-cosmic-border rounded-xl
                     text-cosmic-text placeholder-cosmic-text-faint font-sans text-base
                     focus:outline-none focus:border-cosmic-accent/50 focus:glow-border
                     transition-all duration-300"
        />
        {!value && (
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs
                          font-sans text-cosmic-text-faint bg-cosmic-card rounded border border-cosmic-border">
            /
          </kbd>
        )}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cosmic-text-dim hover:text-cosmic-text
                       transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {value && resultCount !== undefined && (
        <p className="mt-2 text-sm text-cosmic-text-dim font-sans text-center">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </p>
      )}
    </div>
  );
}
