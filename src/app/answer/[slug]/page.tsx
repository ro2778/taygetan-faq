import { getAllAnswers, getAnswerBySlug, getThemeByNumber } from '@/lib/faq';
import Link from 'next/link';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Generate static params for all answers
export function generateStaticParams() {
  return getAllAnswers().map(a => ({ slug: a.slug }));
}

/** Read the raw markdown content of the answer file */
async function getAnswerContent(filename: string): Promise<string> {
  const faqDir = join(process.cwd(), '..', 'FAQ answers');
  try {
    return await readFile(join(faqDir, filename), 'utf-8');
  } catch {
    return '*Answer content not available.*';
  }
}

/** Very simple markdown to HTML — handles headings, bold, italic, paragraphs, lists */
function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inList = false;
  let skippedFirstH1 = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!skippedFirstH1 && /^#\s+/.test(trimmed) && !trimmed.startsWith('## ')) {
      skippedFirstH1 = true;
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h5 class="text-base font-serif font-semibold text-cosmic-text mt-5 mb-2">${formatInline(trimmed.slice(5))}</h5>`);
    } else if (trimmed.startsWith('### ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h4 class="text-lg font-serif font-semibold text-cosmic-text mt-6 mb-2">${formatInline(trimmed.slice(4))}</h4>`);
    } else if (trimmed.startsWith('## ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h3 class="text-xl font-serif font-semibold text-cosmic-text mt-8 mb-3">${formatInline(trimmed.slice(3))}</h3>`);
    } else if (trimmed.startsWith('# ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h2 class="text-2xl font-serif font-semibold text-cosmic-text mt-8 mb-3">${formatInline(trimmed.slice(2))}</h2>`);
    }
    else if (/^!\[.*\]\(.*\)/.test(trimmed)) {
      if (inList) { html.push('</ul>'); inList = false; }
      const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        const alt = imgMatch[1];
        const src = imgMatch[2].replace(/^images\//, '/images/');
        html.push(`<figure class="my-8"><img src="${src}" alt="${alt}" class="w-full rounded-lg border border-cosmic-border" loading="lazy" />`);
        html.push('</figure>');
      }
    }
    else if (/^\*[^*]+\*$/.test(trimmed) && html.length > 0 && html[html.length - 1] === '</figure>') {
      html.pop();
      const captionText = trimmed.slice(1, -1);
      html.push(`<figcaption class="mt-3 text-sm text-cosmic-text-faint italic leading-relaxed">${formatInline(captionText)}</figcaption></figure>`);
    }
    else if (/^[-*_]{3,}$/.test(trimmed)) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<hr class="border-white/10 my-6" />');
    }
    else if (/^[-*]\s/.test(trimmed)) {
      if (!inList) { html.push('<ul class="list-disc list-inside space-y-1 my-3 text-cosmic-text-dim">'); inList = true; }
      html.push(`<li>${formatInline(trimmed.slice(2))}</li>`);
    }
    else if (!trimmed) {
      if (inList) { html.push('</ul>'); inList = false; }
    }
    else {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<p class="text-cosmic-text-dim leading-relaxed my-3">${formatInline(trimmed)}</p>`);
    }
  }
  if (inList) html.push('</ul>');
  return html.join('\n');
}

function formatInline(text: string): string {
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-cosmic-text font-semibold">$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  return text;
}

const TYPE_BADGE: Record<string, string> = {
  Full: 'bg-emerald-900/60 text-emerald-300',
  Short: 'bg-sky-900/60 text-sky-300',
  'No-coverage': 'bg-amber-900/60 text-amber-300',
  Duplicate: 'bg-stone-800/60 text-stone-400',
  Unknown: 'bg-stone-800/60 text-stone-400',
};

export default async function AnswerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const answer = getAnswerBySlug(slug);

  if (!answer) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-serif text-cosmic-text mb-4">Answer not found</h2>
        <Link href="/" className="text-cosmic-accent hover:underline">Back to home</Link>
      </div>
    );
  }

  const theme = getThemeByNumber(answer.themeNumber);
  const rawContent = await getAnswerContent(answer.filename);
  const contentHtml = markdownToHtml(rawContent);

  return (
    <div className="relative min-h-screen">
      {/* ===== Fixed full-screen background ===== */}
      <div className="fixed inset-0 -z-10">
        {/* Wide image (default) */}
        <img
          src="/images/answer-bg-wide.jpg"
          alt=""
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        />
        {/* Narrow image (mobile) */}
        <img
          src="/images/answer-bg-narrow.jpg"
          alt=""
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ===== Title splash — raw background visible, then scroll into glass ===== */}
      <div className="relative min-h-[55vh] flex flex-col justify-end px-5 pb-10 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm font-sans mb-4" style={{ color: 'rgba(255,255,255,0.45)', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
          <Link href="/" className="hover:text-cosmic-accent transition-colors">Home</Link>
          <span className="mx-2">/</span>
          {theme && (
            <>
              <Link
                href={`/theme/${theme.slug}`}
                className="hover:text-cosmic-accent transition-colors"
              >
                {theme.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>
            {answer.qNumber ? `Q${answer.qNumber}` : answer.title.slice(0, 40) + (answer.title.length > 40 ? '…' : '')}
          </span>
        </nav>

        {/* Badges */}
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <span className={`px-3 py-1 text-xs font-sans font-medium rounded-full ${TYPE_BADGE[answer.answerType] || TYPE_BADGE.Unknown}`}>
            {answer.answerType}
          </span>
          {theme && (
            <Link
              href={`/theme/${theme.slug}`}
              className="px-3 py-1 text-xs font-sans bg-white/5 text-white/60
                         rounded-full border border-white/10 hover:border-cosmic-accent/30 transition-colors"
            >
              Theme {theme.number}: {theme.name}
            </Link>
          )}
          <span className="text-xs font-sans" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {answer.wordCount.toLocaleString()} words
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-serif leading-snug"
          style={{
            color: '#ffe8cc',
            textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.3)',
          }}
        >
          {answer.qNumber ? `Q${answer.qNumber}. ` : ''}{answer.title}
        </h1>

        {answer.speakers.length > 0 && (
          <p
            className="text-sm font-sans mt-2"
            style={{ color: 'rgba(212,113,58,0.6)', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
          >
            Speakers: {answer.speakers.join(', ')}
          </p>
        )}
      </div>

      {/* ===== Scrolling glass content panel ===== */}
      <div className="relative">
        {/* The glass panel */}
        <div
          className="mx-auto max-w-3xl px-6 sm:px-10 py-10 rounded-t-2xl"
          style={{
            background: 'rgba(6, 6, 18, 0.62)',
            backdropFilter: 'blur(20px) saturate(1.15)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.15)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderLeft: '1px solid rgba(255,255,255,0.04)',
            borderRight: '1px solid rgba(255,255,255,0.04)',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
          }}
        >
          <article
            className="prose-cosmic"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Transcript sources */}
          {answer.transcripts.length > 0 && (
            <aside
              className="mt-10 p-4 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <h4 className="text-sm font-sans font-semibold text-cosmic-text-dim mb-2">
                Transcript Sources
              </h4>
              <ul className="text-sm font-sans text-cosmic-text-faint space-y-1">
                {answer.transcripts.map((t: string, i: number) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </aside>
          )}

          {/* Navigation */}
          <div
            className="pt-8 mt-8 flex justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Link
              href={theme ? `/theme/${theme.slug}` : '/'}
              className="text-sm font-sans text-cosmic-accent hover:underline"
            >
              ← Back to {theme ? theme.name : 'all answers'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
