import type { AppRouter } from '@lexical.app/api-types';
import { createTRPCClient, httpBatchLink } from '@trpc/client';

export const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3000',
        }),
    ],
});
