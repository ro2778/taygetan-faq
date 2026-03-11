'use client';

import type { Theme } from '@/lib/types';

interface FilterBarProps {
  themes: Theme[];
  answerTypes: string[];
  selectedTheme: number | null;
  selectedType: string | null;
  onThemeChange: (theme: number | null) => void;
  onTypeChange: (type: string | null) => void;
}

const TYPE_COLOURS: Record<string, string> = {
  Full: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  Short: 'bg-sky-900/50 text-sky-300 border-sky-700/50',
  'No-coverage': 'bg-amber-900/50 text-amber-300 border-amber-700/50',
  Duplicate: 'bg-stone-800/50 text-stone-400 border-stone-600/50',
};

export default function FilterBar({
  themes,
  answerTypes,
  selectedTheme,
  selectedType,
  onThemeChange,
  onTypeChange,
}: FilterBarProps) {
  const activeThemes = themes.filter(t => t.count > 0);

  return (
    <div className="space-y-4">
      {/* Theme filter */}
      <div>
        <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-cosmic-text-dim mb-2">
          Theme
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onThemeChange(null)}
            className={`px-3 py-1.5 text-sm font-sans rounded-lg border transition-all duration-200
              ${selectedTheme === null
                ? 'bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/50'
                : 'bg-cosmic-surface text-cosmic-text-dim border-cosmic-border hover:border-cosmic-accent/30'
              }`}
          >
            All
          </button>
          {activeThemes.map(theme => (
            <button
              key={theme.number}
              onClick={() => onThemeChange(selectedTheme === theme.number ? null : theme.number)}
              className={`px-3 py-1.5 text-sm font-sans rounded-lg border transition-all duration-200
                ${selectedTheme === theme.number
                  ? 'bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/50'
                  : 'bg-cosmic-surface text-cosmic-text-dim border-cosmic-border hover:border-cosmic-accent/30'
                }`}
              title={theme.name}
            >
              {theme.number}. {theme.name.length > 25 ? theme.name.slice(0, 25) + '…' : theme.name}
              <span className="ml-1 text-xs opacity-60">({theme.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Answer type filter */}
      <div>
        <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-cosmic-text-dim mb-2">
          Answer Type
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTypeChange(null)}
            className={`px-3 py-1.5 text-sm font-sans rounded-lg border transition-all duration-200
              ${selectedType === null
                ? 'bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/50'
                : 'bg-cosmic-surface text-cosmic-text-dim border-cosmic-border hover:border-cosmic-accent/30'
              }`}
          >
            All
          </button>
          {answerTypes.map(type => (
            <button
              key={type}
              onClick={() => onTypeChange(selectedType === type ? null : type)}
              className={`px-3 py-1.5 text-sm font-sans rounded-lg border transition-all duration-200
                ${selectedType === type
                  ? TYPE_COLOURS[type] || 'bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/50'
                  : 'bg-cosmic-surface text-cosmic-text-dim border-cosmic-border hover:border-cosmic-accent/30'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
