import { Button } from '@/components/ui/button';
import { useClearSavedWordsMutation, useRemoveSavedWordMutation, useSavedWordsQuery } from '@/lib/savedWordsQuery';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function SavedWordsPanel() {
	const savedWordsQuery = useSavedWordsQuery();
	const removeMutation = useRemoveSavedWordMutation();
	const clearMutation = useClearSavedWordsMutation();

	const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

	const saved = savedWordsQuery.data;
	const hasSaved = saved.length > 0;

	const isBusy = removeMutation.isPending || clearMutation.isPending;

	return (
		<div className="w-full max-w-2xl">
			<div className="flex items-center justify-between gap-2">
				<div className="text-text-primary font-medium">Saved words</div>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="destructive"
						size="sm"
						disabled={!hasSaved || isBusy}
						onClick={() => clearMutation.mutate()}
					>
						Clear all
					</Button>
				</div>
			</div>

			{!hasSaved ? (
				<div className="mt-6 text-text-secondary text-sm leading-relaxed">
					No saved words yet. Save a definition above.
				</div>
			) : (
				<div className="mt-6 space-y-4">
					{saved.map((w) => {
						const isExpanded = !!expandedKeys[w.key];
						return (
							<div key={w.key} className="rounded-md border border-input p-4">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<div className="text-text-primary font-medium truncate">{w.word}</div>
										<div className="mt-2 text-text-secondary text-sm leading-relaxed">{w.definition}</div>
									</div>

									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										disabled={isBusy}
										onClick={() => removeMutation.mutate(w.key)}
										aria-label={`Remove ${w.word}`}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>

								{w.examples?.length > 0 && (
									<div className="mt-4">
										<button
											type="button"
											onClick={() =>
												setExpandedKeys((prev) => ({
													...prev,
													[w.key]: !prev[w.key],
												}))
											}
											className="flex items-center gap-1 text-text-primary hover:opacity-80 transition-opacity"
										>
											<ChevronDown
												className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
											/>
											Examples
										</button>
										{isExpanded && (
											<div className="mt-2 space-y-2 pl-5 text-text-secondary text-sm leading-relaxed">
												{w.examples.map((ex, i) => (
													<div key={i}>{ex}</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
