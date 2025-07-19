// lib/reviewDetectorUtils.ts

export interface ReviewAnalysisMetrics {
  wordCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  readabilityScore: number;
  uniqueWords: number;
  repetitivePatterns: string[];
}

export class ReviewAnalyzer {
  /**
   * Calculates basic metrics for a review text
   */
  static getTextMetrics(text: string): ReviewAnalysisMetrics {
    const wordsMatch = text.toLowerCase().match(/\b\w+\b/g);
    const words: string[] = wordsMatch || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const uniqueWords = new Set(words).size;

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      averageWordsPerSentence: sentences.length > 0 ? words.length / sentences.length : 0,
      readabilityScore: this.calculateReadabilityScore(text),
      uniqueWords,
      repetitivePatterns: this.findRepetitivePatterns(text)
    };
  }

  /**
   * Simple readability score calculation (Flesch-like)
   */
  private static calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordsMatch = text.match(/\b\w+\b/g);
    const words: string[] = wordsMatch || [];
    const syllables = words.reduce((count: number, word: string) => count + this.countSyllables(word), 0);

    const wordCount = words.length;
    if (sentences.length === 0 || wordCount === 0) return 0;

    const avgWordsPerSentence = wordCount / sentences.length;
    const avgSyllablesPerWord = syllables / wordCount;

    // Simplified Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Count syllables in a word (approximation)
   */
  private static countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = word.match(/[aeiouy]/g);
    let syllableCount = vowels ? vowels.length : 1;
    
    // Adjust for silent e
    if (word.endsWith('e')) syllableCount--;
    
    // Ensure at least 1 syllable
    return Math.max(1, syllableCount);
  }

  /**
   * Find repetitive patterns that might indicate AI generation
   */
  private static findRepetitivePatterns(text: string): string[] {
    const patterns: string[] = [];
    const sentences = text.split(/[.!?]+/).map(s => s.trim().toLowerCase());
    
    // Check for repeated sentence starters
    const starters = sentences.map(s => s.split(' ').slice(0, 3).join(' ')).filter(s => s.length > 0);
    const starterCounts = new Map<string, number>();
    
    starters.forEach(starter => {
      starterCounts.set(starter, (starterCounts.get(starter) || 0) + 1);
    });

    starterCounts.forEach((count, starter) => {
      if (count > 1 && starter.length > 5) {
        patterns.push(`Repeated sentence starter: "${starter}"`);
      }
    });

    // Check for overly formulaic transitions
    const commonTransitions = [
      'furthermore', 'moreover', 'additionally', 'in conclusion',
      'first and foremost', 'it is worth noting', 'it should be mentioned'
    ];

    commonTransitions.forEach(transition => {
      if (text.toLowerCase().includes(transition)) {
        patterns.push(`Formulaic transition: "${transition}"`);
      }
    });

    return patterns.slice(0, 5); // Limit to 5 patterns
  }

  /**
   * Checks for common AI-generated content indicators
   */
  static getAIIndicators(text: string): string[] {
    const indicators: string[] = [];
    const lowerText = text.toLowerCase();

    // Check for overly positive/perfect language
    const perfectWords = ['exceptional', 'outstanding', 'remarkable', 'phenomenal', 'extraordinary'];
    const perfectCount = perfectWords.filter(word => lowerText.includes(word)).length;
    if (perfectCount >= 2) {
      indicators.push('Excessive use of superlative adjectives');
    }

    // Check for lack of personal pronouns
    const personalPronouns = ['i', 'me', 'my', 'myself'];
    const hasPersonalPronouns = personalPronouns.some(pronoun => 
      lowerText.includes(` ${pronoun} `) || lowerText.startsWith(`${pronoun} `)
    );
    if (!hasPersonalPronouns && text.length > 100) {
      indicators.push('Lack of personal pronouns suggests impersonal writing');
    }

    // Check for overly structured content
    const structureWords = ['firstly', 'secondly', 'thirdly', 'finally', 'in summary'];
    const structureCount = structureWords.filter(word => lowerText.includes(word)).length;
    if (structureCount >= 2) {
      indicators.push('Overly structured format typical of AI writing');
    }

    // Check for generic phrases
    const genericPhrases = [
      'highly recommend', 'would definitely recommend', 'exceeded expectations',
      'amazing experience', 'top-notch', 'five stars', 'couldn\'t be happier'
    ];
    const genericCount = genericPhrases.filter(phrase => lowerText.includes(phrase)).length;
    if (genericCount >= 2) {
      indicators.push('Multiple generic review phrases');
    }

    return indicators;
  }

  /**
   * Checks for human writing characteristics
   */
  static getHumanIndicators(text: string): string[] {
    const indicators: string[] = [];
    const lowerText = text.toLowerCase();

    // Check for typos or informal language
    const informalWords = ['gonna', 'wanna', 'kinda', 'sorta', 'yeah', 'ok', 'okay'];
    const hasInformal = informalWords.some(word => lowerText.includes(word));
    if (hasInformal) {
      indicators.push('Uses informal language and contractions');
    }

    // Check for emotional expressions
    const emotionalWords = ['love', 'hate', 'frustrated', 'excited', 'disappointed', 'thrilled'];
    const emotionalCount = emotionalWords.filter(word => lowerText.includes(word)).length;
    if (emotionalCount >= 1) {
      indicators.push('Contains emotional expressions');
    }

    // Check for specific personal experiences
    const experienceWords = ['when i', 'i was', 'i went', 'my friend', 'my family', 'last week', 'yesterday'];
    const hasExperience = experienceWords.some(phrase => lowerText.includes(phrase));
    if (hasExperience) {
      indicators.push('Contains specific personal experiences');
    }

    // Check for natural imperfections
    const hasEllipsis = text.includes('...');
    const hasExclamations = (text.match(/!/g) || []).length;
    if (hasEllipsis || hasExclamations >= 2) {
      indicators.push('Natural imperfections in punctuation usage');
    }

    return indicators;
  }
}

/**
 * Environment configuration checker
 */
export const checkConfiguration = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!process.env.GEMINI_API_KEY) {
    errors.push('GEMINI_API_KEY environment variable is not set');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};