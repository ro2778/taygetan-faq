import faqData from '@/data/faq-data.json';
import type { FAQData, FAQAnswer, Theme } from './types';

const data = faqData as FAQData;

export function getAllAnswers(): FAQAnswer[] {
  return data.answers;
}

export function getAnswerBySlug(slug: string): FAQAnswer | undefined {
  return data.answers.find(a => a.slug === slug);
}

export function getAnswersByTheme(themeNumber: number): FAQAnswer[] {
  return data.answers.filter(a => a.themeNumber === themeNumber);
}

export function getAnswersByType(type: string): FAQAnswer[] {
  return data.answers.filter(a => a.answerType === type);
}

export function getAllThemes(): Theme[] {
  return data.themes;
}

export function getThemeBySlug(slug: string): Theme | undefined {
  return data.themes.find(t => t.slug === slug);
}

export function getThemeByNumber(num: number): Theme | undefined {
  return data.themes.find(t => t.number === num);
}

export function getAllSpeakers(): string[] {
  return data.speakers;
}

export function getStats() {
  const answers = data.answers;
  return {
    total: answers.length,
    full: answers.filter(a => a.answerType === 'Full').length,
    short: answers.filter(a => a.answerType === 'Short').length,
    noCoverage: answers.filter(a => a.answerType === 'No-coverage').length,
    duplicate: answers.filter(a => a.answerType === 'Duplicate').length,
    activeThemes: data.themes.filter(t => t.count > 0).length,
  };
}
