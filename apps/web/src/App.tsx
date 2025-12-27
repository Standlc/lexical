import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { trpc } from './trpc';

export function App() {
	const [word, setWord] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const hello = trpc.hello.useQuery('World');

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

			{defineMutation.data && (
				<div className="mt-8 w-full max-w-md text-text-secondary text-sm leading-relaxed">{defineMutation.data}</div>
			)}
		</div>
	);
}
