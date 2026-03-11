import Link from 'next/link';
import type { Theme } from '@/lib/types';

const THEME_ICONS: Record<number, string> = {
  1: '⏳',
  2: '🔮',
  3: '🌀',
  4: '✨',
  5: '👽',
  6: '🐱',
  7: '🛸',
  8: '⚡',
  9: '🏛️',
  10: '👻',
  11: '🏺',
  12: '🧬',
  13: '🕵️',
  14: '🔬',
};

export default function ThemeCard({ theme }: { theme: Theme }) {
  if (theme.count === 0) return null;

  return (
    <Link
      href={`/theme/${theme.slug}`}
      className="group block p-5 bg-cosmic-card border border-cosmic-border rounded-xl
                 hover:border-cosmic-accent/40 hover:glow-border
                 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{THEME_ICONS[theme.number] || '📖'}</span>
        <div>
          <p className="text-xs font-sans text-cosmic-text-faint">Theme {theme.number}</p>
          <h3 className="text-base font-serif text-cosmic-text group-hover:text-cosmic-accent transition-colors">
            {theme.name}
          </h3>
        </div>
      </div>
      <p className="text-sm font-sans text-cosmic-text-dim">
        {theme.count} {theme.count === 1 ? 'answer' : 'answers'}
      </p>
    </Link>
  );
}
