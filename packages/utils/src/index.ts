// Example shared utilities that can be used by both app and server

/**
 * Format a word for display
 */
export function formatWord(word: string): string {
    return word.trim().toLowerCase();
}

/**
 * Validate word length
 */
export function isValidWord(word: string): boolean {
    return word.length > 0 && word.length < 100;
}

/**
 * Common constants
 */
export const CONSTANTS = {
    MAX_WORD_LENGTH: 100,
    MIN_WORD_LENGTH: 1,
} as const;


