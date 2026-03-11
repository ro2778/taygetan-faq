/**
 * build-faq-data.mjs
 *
 * Reads FAQ answer files and their manifests from ../FAQ answers/
 * Outputs a single faq-data.json into src/data/ for the Next.js site.
 *
 * Run: node scripts/build-faq-data.mjs
 */

import { readdir, readFile, writeFile, mkdir, copyFile } from 'fs/promises';
import { join, basename } from 'path';
import { existsSync } from 'fs';

const FAQ_DIR = join(import.meta.dirname, '..', '..', 'FAQ answers');
const MANIFEST_DIR = join(FAQ_DIR, 'manifests');
const CONTENTS_FILE = join(FAQ_DIR, 'CONTENTS.md');
const OUTPUT_DIR = join(import.meta.dirname, '..', 'src', 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'faq-data.json');

const THEME_NAMES = {
  1: 'Time, Timelines & Time Travel',
  2: 'Consciousness, Soul & Afterlife',
  3: 'Matrix, Manifestation & Reality',
  4: 'Metaphysics, Spirituality & Ascension',
  5: 'Extraterrestrial Races & Religion',
  6: 'Extraterrestrial Races (Urmah & Others)',
  7: 'Taygetan Society, Contact & Verification',
  8: 'Extraterrestrial Technology',
  9: 'Earth Control & Governance',
  10: 'Astral Entities & Paranormal',
  11: 'Human History & Ancient Civilisations',
  12: 'Biology, Genetics, Health & Diet',
  13: 'Cabal, Earth Control & Current Affairs',
  14: 'Science Critique & Nature of Universe',
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Extract answer type from first ~2000 chars of an answer file */
function detectAnswerType(content) {
  const sample = content.slice(0, 2000).toLowerCase();
  if (sample.includes('**full answer')) return 'Full';
  if (sample.includes('**short answer')) return 'Short';
  if (sample.includes('**duplicate')) return 'Duplicate';
  if (sample.includes('no-coverage') || sample.includes('no coverage')) return 'No-coverage';
  return 'Unknown';
}

/** Parse a manifest file for metadata */
async function parseManifest(filename) {
  try {
    const path = join(MANIFEST_DIR, filename);
    const content = await readFile(path, 'utf-8');
    const meta = {};

    // Extract fields
    const themeMatch = content.match(/## Theme Number\s*\n(\d+)/);
    if (themeMatch) meta.themeNumber = parseInt(themeMatch[1]);

    const typeMatch = content.match(/## Answer Type\s*\n(\S+)/);
    if (typeMatch) meta.answerType = typeMatch[1];

    const speakersMatch = content.match(/## Key Speakers\s*\n([\s\S]*?)(?=\n## |\n---|\Z)/);
    if (speakersMatch) {
      meta.speakers = speakersMatch[1]
        .split('\n')
        .map(l => l.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean);
    }

    const transcriptsMatch = content.match(/## Transcript Sources\s*\n([\s\S]*?)(?=\n## |\n---|\Z)/);
    if (transcriptsMatch) {
      meta.transcripts = transcriptsMatch[1]
        .split('\n')
        .map(l => l.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean);
    }

    const summaryMatch = content.match(/## Summary\s*\n([\s\S]*?)(?=\n## |\n---|\Z)/);
    if (summaryMatch) meta.summary = summaryMatch[1].trim();

    const qMatch = content.match(/## Q Number\s*\n\s*Q?(\d+)/i);
    if (qMatch) meta.qNumber = parseInt(qMatch[1]);

    return meta;
  } catch {
    return {};
  }
}

/** Extract the question title from the answer file content */
function extractTitle(content, filename) {
  // Try H1 heading: # Title
  const h1 = content.match(/^#\s+(.+)/m);
  if (h1) return h1[1].trim();
  // Try ## Q\d+: Title (numbered question format)
  const qHeading = content.match(/^##\s+Q\d+:\s*(.+)/m);
  if (qHeading) return qHeading[1].trim();
  // Try ## Title (first H2 that looks like a question title, not a section name)
  const h2 = content.match(/^##\s+(.+\?)\s*$/m);
  if (h2) return h2[1].trim();
  // Fall back to filename (more reliable than searching for bold text)
  const fromFilename = filename.replace(/\.md$/, '');
  if (fromFilename.length > 10) return fromFilename;
  // Last resort: try bold question
  const bold = content.match(/\*\*(.+?)\*\*/);
  if (bold && bold[1].length < 200) return bold[1].trim();
  return fromFilename;
}

/** Extract a plain-text excerpt from the answer body */
function extractExcerpt(content, maxLen = 200) {
  // Skip past the title and answer-type marker
  const lines = content.split('\n');
  let body = '';
  let started = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!started) {
      // Skip heading, blank lines, answer type markers, and horizontal rules
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('**') || /^[-*_]{3,}$/.test(trimmed)) continue;
      started = true;
    }
    if (started) {
      body += trimmed + ' ';
      if (body.length > maxLen + 50) break;
    }
  }
  body = body.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // strip links
  body = body.replace(/\*\*|__/g, ''); // strip bold
  body = body.replace(/\*|_/g, ''); // strip italic
  if (body.length > maxLen) body = body.slice(0, maxLen).replace(/\s\S*$/, '') + '…';
  return body.trim();
}

async function main() {
  console.log('Building FAQ data…');

  // Read all answer files
  const allFiles = await readdir(FAQ_DIR);
  // Exclude non-answer files
  const EXCLUDED = new Set([
    'CONTENTS.md',
    'MERGE-INSTRUCTIONS.md',
    'NO-COVERAGE-ANSWERS.manifest.md',
  ]);
  const answerFiles = allFiles.filter(
    f => f.endsWith('.md') && !EXCLUDED.has(f) && !f.startsWith('.')
  );

  console.log(`Found ${answerFiles.length} answer files`);

  // Read all manifests
  let manifestFiles = [];
  try {
    manifestFiles = (await readdir(MANIFEST_DIR)).filter(f => f.endsWith('.manifest.md'));
  } catch {
    console.warn('No manifests directory found');
  }

  // Build manifest lookup by base name
  const manifestMap = {};
  for (const mf of manifestFiles) {
    const base = mf.replace('.manifest.md', '');
    manifestMap[base] = mf;
  }

  const answers = [];
  const allSpeakers = new Set();
  const themeCounts = {};

  for (const file of answerFiles) {
    const content = await readFile(join(FAQ_DIR, file), 'utf-8');
    const baseName = file.replace(/\.md$/, '');
    const slug = slugify(baseName);

    // Get manifest metadata
    const manifestFile = manifestMap[baseName];
    const manifest = manifestFile ? await parseManifest(manifestFile) : {};

    // Detect answer type from content if not in manifest
    const answerType = manifest.answerType || detectAnswerType(content);
    const themeNumber = manifest.themeNumber || 0;
    const themeName = THEME_NAMES[themeNumber] || 'Uncategorised';
    const speakers = manifest.speakers || [];
    const title = extractTitle(content, file);
    const excerpt = extractExcerpt(content);
    const wordCount = content.split(/\s+/).length;

    speakers.forEach(s => allSpeakers.add(s));
    themeCounts[themeNumber] = (themeCounts[themeNumber] || 0) + 1;

    answers.push({
      slug,
      filename: file,
      title,
      excerpt,
      answerType,
      themeNumber,
      themeName,
      themeSlug: slugify(themeName),
      speakers,
      transcripts: manifest.transcripts || [],
      summary: manifest.summary || '',
      qNumber: manifest.qNumber || null,
      wordCount,
    });
  }

  // Sort by theme, then by Q number (if available), then alphabetically
  answers.sort((a, b) => {
    if (a.themeNumber !== b.themeNumber) return a.themeNumber - b.themeNumber;
    if (a.qNumber && b.qNumber) return a.qNumber - b.qNumber;
    if (a.qNumber) return -1;
    if (b.qNumber) return 1;
    return a.title.localeCompare(b.title);
  });

  // Build themes index
  const themes = Object.entries(THEME_NAMES).map(([num, name]) => ({
    number: parseInt(num),
    name,
    slug: slugify(name),
    count: themeCounts[parseInt(num)] || 0,
  }));

  const data = {
    generatedAt: new Date().toISOString(),
    totalAnswers: answers.length,
    themes,
    speakers: [...allSpeakers].sort(),
    answerTypes: ['Full', 'Short', 'No-coverage', 'Duplicate'],
    answers,
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Wrote ${OUTPUT_FILE}`);
  console.log(`  ${answers.length} answers across ${themes.filter(t => t.count > 0).length} themes`);
  console.log(`  ${allSpeakers.size} unique speakers`);

  // Sync images from FAQ answers/images/ to public/images/
  const IMG_SRC = join(FAQ_DIR, 'images');
  const IMG_DEST = join(import.meta.dirname, '..', 'public', 'images');
  await mkdir(IMG_DEST, { recursive: true });
  try {
    const imgFiles = await readdir(IMG_SRC);
    let copied = 0;
    for (const img of imgFiles) {
      if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(img)) {
        await copyFile(join(IMG_SRC, img), join(IMG_DEST, img));
        copied++;
      }
    }
    console.log(`  ${copied} images synced to public/images/`);
  } catch {
    console.log('  No images directory found (FAQ answers/images/)');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
