import { getAllThemes, getThemeBySlug, getAllAnswers } from '@/lib/faq';
import AnswerCard from '@/components/AnswerCard';
import Link from 'next/link';

// Generate static params for all themes
export function generateStaticParams() {
  return getAllThemes()
    .filter(t => t.count > 0)
    .map(t => ({ slug: t.slug }));
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);

  if (!theme) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-serif text-cosmic-text mb-4">Theme not found</h2>
        <Link href="/" className="text-cosmic-accent hover:underline">Back to home</Link>
      </div>
    );
  }

  const answers = getAllAnswers().filter(a => a.themeNumber === theme.number);
  const fullCount = answers.filter(a => a.answerType === 'Full').length;
  const shortCount = answers.filter(a => a.answerType === 'Short').length;
  const ncCount = answers.filter(a => a.answerType === 'No-coverage').length;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm font-sans text-cosmic-text-faint">
        <Link href="/" className="hover:text-cosmic-accent transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-cosmic-text-dim">Theme {theme.number}</span>
      </nav>

      {/* Theme header */}
      <div>
        <p className="text-sm font-sans text-cosmic-accent mb-1">Theme {theme.number}</p>
        <h2 className="text-3xl font-serif text-cosmic-text mb-3">{theme.name}</h2>
        <div className="flex gap-4 text-sm font-sans text-cosmic-text-dim">
          <span>{theme.count} answers</span>
          {fullCount > 0 && <span>{fullCount} full</span>}
          {shortCount > 0 && <span>{shortCount} short</span>}
          {ncCount > 0 && <span>{ncCount} no-coverage</span>}
        </div>
      </div>

      {/* Theme navigation */}
      <div className="flex flex-wrap gap-2">
        {getAllThemes()
          .filter(t => t.count > 0)
          .map(t => (
            <Link
              key={t.number}
              href={`/theme/${t.slug}`}
              className={`px-3 py-1.5 text-sm font-sans rounded-lg border transition-all
                ${t.number === theme.number
                  ? 'bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/50'
                  : 'bg-cosmic-surface text-cosmic-text-dim border-cosmic-border hover:border-cosmic-accent/30'
                }`}
            >
              {t.number}
            </Link>
          ))}
      </div>

      {/* Answer list */}
      <div className="space-y-3">
        {answers.map(answer => (
          <AnswerCard key={answer.slug} answer={answer} />
        ))}
      </div>
    </div>
  );
}
