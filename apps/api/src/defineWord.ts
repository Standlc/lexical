import { openai } from '@ai-sdk/openai';
import { TRPCError } from '@trpc/server';
import { generateText, Output } from 'ai';
import { z } from 'zod';

const SystemPrompt = `
You are a word dictionary that defines the given word in a concise manner.
`;

export const defineWord = async (word: string) => {
	try {
		const result = await generateText({
			model: openai('gpt-5.1'),
			system: SystemPrompt,
			prompt: word,
			output: Output.object({
				schema: z.object({
					definition: z.string().describe('The definition of the word'),
					examples: z.array(z.string()).describe('2 examples of how to use the word in a sentence'),
				}),
			}),
		});
		return result.output;
	} catch (error) {
		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Sorry, something went wrong. Please try again.',
			cause: error,
		});
	}
};
