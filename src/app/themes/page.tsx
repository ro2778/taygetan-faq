import Link from 'next/link';
import { getAllThemes, getAllAnswers } from '@/lib/faq';

const THEME_ICONS: Record<number, string> = {
  1: '🌌',  // Consciousness, Soul & Afterlife
  2: '🔮',  // Matrix, Manifestation & Reality
  3: '👤',  // Backdrop People, NPCs & Organic Portals
  4: '🛡️',  // Galactic Federation
  5: '📜',  // Human History, Religion & Ancient Civilisations
  6: '👽',  // Extraterrestrial Races
  7: '✦',   // Taygetan Society, Contact & Verification
  8: '🛸',  // ET Technology
  9: '🌱',  // Starseeds & Life Guidance
  10: '👻', // Astral, Entities & Spiritual Protection
  11: '🏛️', // Cabal & Earth Control
  12: '🧬', // Biology, Health & Diet
  13: '✨',  // Metaphysics & Spirituality
  14: '🔬', // Science & Universe
};

const THEME_DESCRIPTIONS: Record<number, string> = {
  1: 'The nature of the soul, what happens after death, the afterlife process, reincarnation mechanics, and the deeper nature of consciousness.',
  2: 'The 3D Matrix, how densities and dimensions work, manifestation and the law of attraction, the Van Allen belts, and breaking free of the frequency fence.',
  3: 'Are most people on Earth real? The backdrop people phenomenon — NPCs, organic portals, and what it means for those with souls.',
  4: 'What is the Galactic Federation, who runs it, and is it helping or hindering humanity? The Prime Directive, the Alcyone Council, and Federation politics.',
  5: 'The true history of Egypt, Atlantis, Tartaria, and ancient civilisations — plus the ET origins of Jesus, Mohammed, the Bible, and world religions.',
  6: 'Profiles of non-human races including the Urmah felines, Alpha Draconians, Karistus, Greys, Andromedans, and other civilisations involved with Earth.',
  7: 'Daily life in Taygetan society, how the contact with Gosia and Robert works, and how to verify the authenticity of the information shared.',
  8: 'Starship propulsion, Med Pods, replicators, immersion pods, Black Goo, AI, and technologies beyond current Earth understanding.',
  9: 'How to know if you\'re a starseed, practical guidance for awakening, raising your vibration, and what ordinary people can do with this information.',
  10: 'Astral entities, egregors, sleep paralysis, spiritual protection, shadow work, and the non-physical beings that exist beyond normal perception.',
  11: 'Who really controls Earth, the Cabal\'s agenda, mind control, chemtrails, 5G, and the hidden power structures behind world events.',
  12: 'Vaccines, viruses, DNA activation, diet, detoxing, and the body from a stellar perspective — health as understood by advanced races.',
  13: 'Ascension, karma, the nature of Source, the purpose of suffering, and the deepest metaphysical questions about existence and consciousness.',
  14: 'Where Earth science gets it wrong — gravity, the speed of light, base-12 mathematics, holographic physics, and the true nature of the universe.',
};

export default function ThemesPage() {
  const themes = getAllThemes().filter(t => t.count > 0);
  const allAnswers = getAllAnswers();

  return (
    <div className="relative min-h-screen">
      {/* Fixed full-screen background — image 1 (single figure, portrait crop) */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/images/themes-bg-wide.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle permanent overlay for readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(6,6,18,0.25)' }}
        />
      </div>

      {/* Title area — over raw background */}
      <div className="relative min-h-[35vh] flex flex-col justify-end px-5 pb-8 max-w-5xl mx-auto">
        <nav
          className="text-sm font-sans mb-4"
          style={{ color: 'rgba(255,255,255,0.45)', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
        >
          <Link href="/" className="hover:text-cosmic-accent transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Themes</span>
        </nav>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-[4px]"
          style={{
            color: '#ffe8cc',
            textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.3)',
          }}
        >
          EXPLORE BY THEME
        </h1>
        <p
          className="text-sm font-sans mt-3 max-w-lg"
          style={{ color: 'rgba(232,224,208,0.5)', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
        >
          {themes.length} themes spanning {allAnswers.length} answers from the Taygetan contact transcripts.
        </p>
      </div>

      {/* Theme cards grid — glass cards over fixed background */}
      <div className="relative px-5 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map(theme => {
            const answers = allAnswers.filter(a => a.themeNumber === theme.number);
            const fullCount = answers.filter(a => a.answerType === 'Full').length;
            const shortCount = answers.filter(a => a.answerType === 'Short').length;
            const icon = THEME_ICONS[theme.number] || '◆';

            return (
              <Link
                key={theme.number}
                href={`/theme/${theme.slug}`}
                className="group flex flex-col rounded-xl overflow-hidden transition-all duration-300
                           hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(212,113,58,0.12)]"
                style={{
                  background: 'rgba(6, 6, 18, 0.55)',
                  backdropFilter: 'blur(16px) saturate(1.1)',
                  WebkitBackdropFilter: 'blur(16px) saturate(1.1)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="p-6 flex-1 flex flex-col">
                  {/* Icon + number */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{icon}</span>
                    <span
                      className="text-xs font-sans font-medium tracking-wider uppercase"
                      style={{ color: 'rgba(212,113,58,0.6)' }}
                    >
                      Theme {theme.number}
                    </span>
                  </div>

                  {/* Name */}
                  <h2
                    className="text-lg font-serif leading-snug mb-2 transition-colors duration-300
                               group-hover:text-[#ffe8cc]"
                    style={{ color: 'rgba(232,224,208,0.85)' }}
                  >
                    {theme.name}
                  </h2>

                  {/* Description — grows to fill space, pushing stats to bottom */}
                  {THEME_DESCRIPTIONS[theme.number] && (
                    <p
                      className="text-xs font-sans leading-relaxed mb-3 flex-1"
                      style={{ color: 'rgba(232,224,208,0.38)' }}
                    >
                      {THEME_DESCRIPTIONS[theme.number]}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs font-sans" style={{ color: 'rgba(232,224,208,0.35)' }}>
                    <span>{theme.count} answers</span>
                    {fullCount > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                        {fullCount} full
                      </span>
                    )}
                    {shortCount > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500/60" />
                        {shortCount} short
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="h-[2px] transition-all duration-300 group-hover:opacity-100 opacity-0"
                  style={{
                    background: 'linear-gradient(to right, transparent, rgba(212,113,58,0.4), transparent)',
                  }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
