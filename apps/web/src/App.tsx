import { APP_NAME } from "@lexical/shared";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { trpc } from "./trpc";

export function App() {
	const [word, setWord] = useState("");
	const [definition, setDefinition] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [searchedWord, setSearchedWord] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const definitionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		trpc.hello
			.query("world")
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!word.trim() || isLoading) return;

		setIsLoading(true);
		setDefinition("");
		setSearchedWord(word.trim());

		try {
			const response = await axios.post(
				"/api/define",
				{ word: word.trim() },
				{
					responseType: "stream",
					adapter: "fetch",
				},
			);

			const reader = response.data.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				setDefinition((prev) => prev + chunk);
			}
		} catch (error) {
			setDefinition("Sorry, something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleClear = () => {
		setWord("");
		setDefinition("");
		setSearchedWord("");
		inputRef.current?.focus();
	};

	return (
		<div className="min-h-screen flex flex-col relative overflow-x-hidden">
			{/* Atmospheric background */}
			<div
				className="fixed inset-0 pointer-events-none z-0"
				style={{
					background: `
						radial-gradient(ellipse 80% 50% at 50% -20%, rgba(230, 180, 100, 0.06) 0%, transparent 50%),
						radial-gradient(ellipse 60% 40% at 80% 100%, rgba(201, 160, 160, 0.04) 0%, transparent 40%),
						radial-gradient(ellipse 50% 30% at 20% 80%, rgba(212, 165, 116, 0.03) 0%, transparent 40%)
					`,
				}}
			/>

			<header className="text-center pt-16 pb-8 px-8 max-sm:pt-12 max-sm:pb-6 max-sm:px-6 relative z-10 animate-fade-in-down">
				<h1 className="font-serif text-[clamp(3rem,8vw,5rem)] max-sm:text-[2.5rem] font-semibold tracking-tight text-text-primary flex items-center justify-center gap-2">
					<span className="text-[0.7em] grayscale-[20%]">📖</span>
					{APP_NAME}
				</h1>
				<p className="font-serif text-xl max-sm:text-base italic text-text-secondary mt-2 tracking-wide">
					Discover the beauty of words
				</p>
			</header>

			<main className="flex-1 max-w-[720px] w-full mx-auto px-8 py-8 max-sm:px-6 max-sm:py-6 relative z-10">
				<form onSubmit={handleSubmit} className="mb-8 animate-fade-in-up-delayed">
					<div className="flex bg-bg-card border border-border-subtle rounded-full p-1.5 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] focus-within:border-border-accent focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_60px_rgba(230,180,100,0.08)]">
						<input
							ref={inputRef}
							type="text"
							value={word}
							onChange={(e) => setWord(e.target.value)}
							placeholder="Enter a word to define..."
							className="flex-1 bg-transparent border-none py-4 px-6 max-sm:py-3.5 max-sm:px-4 font-sans text-lg max-sm:text-base text-text-primary outline-none placeholder:text-text-muted disabled:opacity-70"
							disabled={isLoading}
						/>
						<button
							type="submit"
							className="w-14 h-14 max-sm:w-12 max-sm:h-12 rounded-full border-none bg-linear-to-br from-accent-gold to-accent-warm text-bg-deep text-2xl max-sm:text-xl cursor-pointer flex items-center justify-center transition-all duration-200 hover:enabled:scale-105 hover:enabled:shadow-[0_4px_20px_rgba(230,180,100,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isLoading || !word.trim()}
						>
							{isLoading ? (
								<span className="w-6 h-6 border-3 border-bg-deep/20 border-t-bg-deep rounded-full animate-spin" />
							) : (
								<span className="font-semibold">→</span>
							)}
						</button>
					</div>
				</form>

				{(definition || isLoading) && (
					<div
						className="bg-bg-card border border-border-subtle rounded-3xl p-8 max-sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-fade-in-up"
						ref={definitionRef}
					>
						{searchedWord && (
							<div className="flex justify-between items-start mb-6 pb-6 border-b border-border-subtle">
								<h2 className="font-serif text-[2.5rem] max-sm:text-[2rem] font-semibold text-accent-gold tracking-tight">
									{searchedWord}
								</h2>
								{!isLoading && (
									<button
										onClick={handleClear}
										className="bg-bg-elevated border border-border-subtle text-text-secondary w-9 h-9 rounded-full cursor-pointer text-base transition-all duration-200 hover:bg-white/10 hover:text-text-primary"
									>
										✕
									</button>
								)}
							</div>
						)}
						<div className="relative">
							{definition ? (
								<FormattedDefinition text={definition} />
							) : (
								<div className="flex flex-col gap-3">
									<div className="h-4 bg-linear-to-r from-bg-elevated via-white/5 to-bg-elevated bg-[length:200%_100%] rounded-lg animate-shimmer" />
									<div className="h-4 w-[60%] bg-linear-to-r from-bg-elevated via-white/5 to-bg-elevated bg-[length:200%_100%] rounded-lg animate-shimmer" />
									<div className="h-4 bg-linear-to-r from-bg-elevated via-white/5 to-bg-elevated bg-[length:200%_100%] rounded-lg animate-shimmer" />
								</div>
							)}
							{isLoading && (
								<span className="inline-block w-0.5 h-[1.2em] bg-accent-gold ml-0.5 align-text-bottom animate-blink" />
							)}
						</div>
					</div>
				)}

				{!definition && !isLoading && (
					<div className="text-center animate-fade-in-up-more-delayed">
						<p className="text-sm text-text-muted mb-4 uppercase tracking-widest">Try these words:</p>
						<div className="flex flex-wrap justify-center gap-3">
							{["serendipity", "ephemeral", "eloquent", "mellifluous", "petrichor"].map((suggestion) => (
								<button
									key={suggestion}
									onClick={() => {
										setWord(suggestion);
										inputRef.current?.focus();
									}}
									className="bg-bg-card border border-border-subtle text-text-secondary py-2.5 px-5 rounded-full font-serif text-base italic cursor-pointer transition-all duration-200 hover:bg-accent-gold-dim hover:border-border-accent hover:text-accent-gold hover:-translate-y-0.5"
								>
									{suggestion}
								</button>
							))}
						</div>
					</div>
				)}
			</main>

			<footer className="text-center p-8 text-text-muted text-sm relative z-10">
				<p>Powered by AI • Built with curiosity</p>
			</footer>
		</div>
	);
}

function FormattedDefinition({ text }: { text: string }) {
	// Simple markdown-like formatting
	const lines = text.split("\n");

	return (
		<div className="leading-relaxed">
			{lines.map((line, i) => {
				// Headers
				if (line.startsWith("## ")) {
					return (
						<h3 key={i} className="font-serif text-2xl font-semibold text-accent-warm mt-6 mb-3 first:mt-0">
							{line.replace("## ", "")}
						</h3>
					);
				}
				if (line.startsWith("**") && line.endsWith("**")) {
					return (
						<h4
							key={i}
							className="font-sans text-base font-semibold text-accent-rose mt-5 mb-2 uppercase tracking-wider"
						>
							{line.replace(/\*\*/g, "")}
						</h4>
					);
				}
				// Bold text within lines
				if (line.includes("**")) {
					const parts = line.split(/(\*\*.*?\*\*)/g);
					return (
						<p key={i} className="text-text-primary mb-3">
							{parts.map((part, j) =>
								part.startsWith("**") && part.endsWith("**") ? (
									<strong key={j} className="text-accent-gold font-semibold">
										{part.replace(/\*\*/g, "")}
									</strong>
								) : (
									part
								),
							)}
						</p>
					);
				}
				// List items
				if (line.startsWith("- ") || line.startsWith("• ")) {
					return (
						<li key={i} className="text-text-primary ml-6 mb-2 marker:text-accent-gold">
							{line.replace(/^[-•] /, "")}
						</li>
					);
				}
				// Numbered list
				if (/^\d+\.\s/.test(line)) {
					return (
						<li key={i} className="text-text-primary ml-6 mb-2 list-decimal marker:text-accent-gold">
							{line.replace(/^\d+\.\s/, "")}
						</li>
					);
				}
				// Italic text
				if (line.includes("*") && !line.includes("**")) {
					const parts = line.split(/(\*.*?\*)/g);
					return (
						<p key={i} className="text-text-primary mb-3">
							{parts.map((part, j) =>
								part.startsWith("*") && part.endsWith("*") ? (
									<em key={j} className="text-text-secondary italic">
										{part.replace(/\*/g, "")}
									</em>
								) : (
									part
								),
							)}
						</p>
					);
				}
				// Empty lines as breaks
				if (!line.trim()) {
					return <br key={i} />;
				}
				// Regular paragraphs
				return (
					<p key={i} className="text-text-primary mb-3">
						{line}
					</p>
				);
			})}
		</div>
	);
}
