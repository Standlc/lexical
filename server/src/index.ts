import { formatWord } from '@lexical.app/utils';
import { wordSchema, type WordInput } from '@lexical.app/validators';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { publicProcedure, router } from './trpc';

const appRouter = router({
    hello: publicProcedure.query(() => 'Hello, world!'),

    // Example: Validate a word using shared schema
    validateWord: publicProcedure.input(wordSchema).query(({ input }: { input: WordInput }) => {
        const formatted = formatWord(input.word);
        return {
            valid: true,
            word: formatted,
            language: input.language,
        };
    }),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    router: appRouter,
});

server.listen(3000);
