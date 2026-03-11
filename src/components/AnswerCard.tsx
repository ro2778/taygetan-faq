import Link from 'next/link';
import type { FAQAnswer } from '@/lib/types';

const TYPE_BADGE: Record<string, string> = {
  Full: 'bg-emerald-900/60 text-emerald-300',
  Short: 'bg-sky-900/60 text-sky-300',
  'No-coverage': 'bg-amber-900/60 text-amber-300',
  Duplicate: 'bg-stone-800/60 text-stone-400',
  Unknown: 'bg-stone-800/60 text-stone-400',
};

export default function AnswerCard({ answer }: { answer: FAQAnswer }) {
  return (
    <Link
      href={`/answer/${answer.slug}`}
      className="group block p-5 bg-cosmic-card border border-cosmic-border rounded-xl
                 hover:border-cosmic-accent/40 hover:glow-border
                 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-serif text-cosmic-text group-hover:text-cosmic-accent transition-colors leading-snug">
          {answer.qNumber ? `Q${answer.qNumber}. ` : ''}{answer.title}
        </h3>
        <span className={`shrink-0 px-2 py-0.5 text-xs font-sans font-medium rounded-full ${TYPE_BADGE[answer.answerType] || TYPE_BADGE.Unknown}`}>
          {answer.answerType}
        </span>
      </div>

      <p className="text-sm text-cosmic-text-dim leading-relaxed mb-3">
        {answer.excerpt}
      </p>

      <div className="flex items-center gap-3 text-xs font-sans text-cosmic-text-faint">
        <span className="px-2 py-0.5 bg-cosmic-surface rounded">
          Theme {answer.themeNumber}
        </span>
        <span>{answer.wordCount.toLocaleString()} words</span>
        {answer.speakers.length > 0 && (
          <span>{answer.speakers.slice(0, 3).join(', ')}</span>
        )}
      </div>
    </Link>
  );
}
