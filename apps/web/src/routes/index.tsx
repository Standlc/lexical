import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/trpc';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const Route = createFileRoute('/')({
	component: Index,
});

function Index() {
	const [word, setWord] = useState('');
	const [showExamples, setShowExamples] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	// const hello = trpc.hello.useQuery('World');

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const defineMutation = trpc.define.useMutation({
		onError: (e) => {
			console.log('error', e);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!word.trim() || defineMutation.isPending) return;
		defineMutation.mutate(word.trim());
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-8">
			<form onSubmit={handleSubmit} className="w-full max-w-md">
				<div className="flex gap-2">
					<Input
						ref={inputRef}
						value={word}
						onChange={(e) => setWord(e.target.value)}
						placeholder="Search a word..."
						disabled={defineMutation.isPending}
						className="flex-1"
					/>
					<Button type="submit" size="icon" disabled={defineMutation.isPending || !word.trim()}>
						{defineMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
					</Button>
				</div>
			</form>

			{defineMutation.error ? (
				<div className="mt-8 w-full max-w-md text-foreground text-sm leading-relaxed">
					{defineMutation.error.message}
				</div>
			) : defineMutation.data ? (
				<div className="mt-8 w-full max-w-md text-text-secondary text-sm leading-relaxed">
					<p>{defineMutation.data.definition}</p>
					{defineMutation.data.examples?.length > 0 && (
						<div className="mt-4">
							<button
								type="button"
								onClick={() => setShowExamples(!showExamples)}
								className="flex items-center gap-1 text-text-primary hover:opacity-80 transition-opacity"
							>
								<ChevronDown className={`h-4 w-4 transition-transform ${showExamples ? 'rotate-0' : '-rotate-90'}`} />
								Examples
							</button>
							{showExamples && (
								<div className="mt-2 space-y-2 pl-5">
									{defineMutation.data.examples.map((example, i) => (
										<div key={i}>{example}</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			) : null}
		</div>
	);
}
