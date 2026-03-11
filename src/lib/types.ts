export interface FAQAnswer {
  slug: string;
  filename: string;
  title: string;
  excerpt: string;
  answerType: 'Full' | 'Short' | 'No-coverage' | 'Duplicate' | 'Unknown';
  themeNumber: number;
  themeName: string;
  themeSlug: string;
  speakers: string[];
  transcripts: string[];
  summary: string;
  qNumber: number | null;
  wordCount: number;
}

export interface Theme {
  number: number;
  name: string;
  slug: string;
  count: number;
}

export interface FAQData {
  generatedAt: string;
  totalAnswers: number;
  themes: Theme[];
  speakers: string[];
  answerTypes: string[];
  answers: FAQAnswer[];
}
