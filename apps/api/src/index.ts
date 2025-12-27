import { openai } from '@ai-sdk/openai';
import { serve } from '@hono/node-server';
import { trpcServer } from '@hono/trpc-server';
import { TRPCError } from '@trpc/server';
import { generateText } from 'ai';
import console from 'console';
import { Hono } from 'hono';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';

console.log(process.env.OPENAI_API_KEY);

const appRouter = router({
	hello: publicProcedure.input(z.string()).query(({ input }) => {
		return `Hello ${input}`;
	}),
	define: publicProcedure.input(z.string()).mutation(async ({ input }) => {
		console.log('input', input);
		const { text } = await generateText({
			model: openai('gpt-5.1'),
			system: 'You are a helpful assistant that defines words.',
			messages: [
				{
					role: 'user',
					content: `Define the word "${input}" in one paragraph.`,
				},
			],
		}).catch((error) => {
			console.log('error', error);
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Sorry, something went wrong. Please try again.',
				cause: error,
			});
			// return 'Sorry, something went wrong. Please try again.';
		});
		return text;
	}),
});

export type AppRouter = typeof appRouter;

const app = new Hono();

app.use(
	'/api/trpc/*',
	trpcServer({
		endpoint: '/api/trpc',
		router: appRouter,
	}),
);

serve(
	{
		fetch: app.fetch,
		port: 5000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
