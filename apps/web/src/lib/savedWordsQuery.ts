import {
	loadSavedWords,
	normalizeWord,
	persistSavedWords,
	SAVED_WORDS_STORAGE_KEY,
	type SavedWord,
} from '@/lib/savedWordsStorage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const savedWordsQueryKey = ['savedWords'] as const;

export type SaveWordInput = {
	word: string;
	definition: string;
	examples: string[];
};

function sortNewestFirst(words: SavedWord[]): SavedWord[] {
	return [...words].sort((a, b) => b.savedAt - a.savedAt);
}

function dedupeKeepFirst(existing: SavedWord[], next: SavedWord): SavedWord[] {
	const alreadyExists = existing.some((w) => w.key === next.key);
	if (alreadyExists) return existing;
	return sortNewestFirst([...existing, next]);
}

export function useSavedWordsQuery() {
	return useQuery({
		queryKey: savedWordsQueryKey,
		queryFn: () => sortNewestFirst(loadSavedWords()),
		initialData: [],
	});
}

export function useSaveWordMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: SaveWordInput) => {
			const current = loadSavedWords();
			const key = normalizeWord(input.word);

			const entry: SavedWord = {
				key,
				word: input.word.trim(),
				definition: input.definition,
				examples: input.examples ?? [],
				savedAt: Date.now(),
			};

			const next = dedupeKeepFirst(current, entry);
			persistSavedWords(next);
			return next;
		},
		onSuccess: (next) => {
			queryClient.setQueryData(savedWordsQueryKey, next);
		},
	});
}

export function useRemoveSavedWordMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (key: string) => {
			const current = loadSavedWords();
			const next = current.filter((w) => w.key !== key);
			persistSavedWords(next);
			return sortNewestFirst(next);
		},
		onSuccess: (next) => {
			queryClient.setQueryData(savedWordsQueryKey, next);
		},
	});
}

export function useClearSavedWordsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const next: SavedWord[] = [];
			persistSavedWords(next);
			return next;
		},
		onSuccess: (next) => {
			queryClient.setQueryData(savedWordsQueryKey, next);
		},
	});
}

export function useSavedWordsCrossTabSync() {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const onStorage = (e: StorageEvent) => {
			if (e.key !== null && e.key !== SAVED_WORDS_STORAGE_KEY) return;
			queryClient.invalidateQueries({ queryKey: savedWordsQueryKey });
		};

		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, [queryClient]);
}
