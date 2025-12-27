import type { AppRouter } from '@lexical/api';
import { type CreateTRPCReact, createTRPCReact, httpBatchLink } from '@trpc/react-query';

export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();
export const trpcClient = trpc.createClient({
	links: [
		httpBatchLink({
			url: '/api/trpc',
		}),
	],
});

export type { AppRouter };
