import { z } from 'zod';

/**
 * Shared Zod schemas for validation across frontend and backend
 */

// Word validation schema
export const wordSchema = z.object({
    word: z.string().min(1, 'Word cannot be empty').max(100, 'Word is too long').trim().toLowerCase(),
    language: z.enum(['en', 'es', 'fr', 'de']).default('en'),
});

export type WordInput = z.infer<typeof wordSchema>;

// Vocabulary item schema
export const vocabularyItemSchema = z.object({
    id: z.string().uuid(),
    word: z.string(),
    definition: z.string(),
    examples: z.array(z.string()),
    language: z.string(),
    createdAt: z.date(),
});

export type VocabularyItem = z.infer<typeof vocabularyItemSchema>;

// API response schemas
export const apiResponseSchema = z.object({
    success: z.boolean(),
    data: z.unknown().optional(),
    error: z.string().optional(),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;





