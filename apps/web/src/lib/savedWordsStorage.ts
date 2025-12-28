import { z } from 'zod';

const SavedWordSchema = z.object({
	key: z.string(),
	word: z.string(),
	definition: z.string(),
	examples: z.array(z.string()),
	savedAt: z.number(),
});

export type SavedWord = z.infer<typeof SavedWordSchema>;

export const SAVED_WORDS_STORAGE_KEY = 'lexical.savedWords.v1';

export function normalizeWord(word: string): string {
	return word.trim().toLowerCase();
}

const SavedWordsSchema = z.array(SavedWordSchema);

export function loadSavedWords(): SavedWord[] {
	if (typeof window === 'undefined') return [];

	try {
		const raw = window.localStorage.getItem(SAVED_WORDS_STORAGE_KEY);
		if (!raw) return [];

		const parsed: unknown = JSON.parse(raw);
		const validated = SavedWordsSchema.safeParse(parsed);
		return validated.success ? validated.data : [];
	} catch {
		return [];
	}
}

export function persistSavedWords(next: SavedWord[]): void {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(SAVED_WORDS_STORAGE_KEY, JSON.stringify(next));
	} catch {
		// Ignore quota / serialization errors; UI state is still kept in-memory via React Query cache.
	}
}
