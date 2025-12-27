import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";

const appRouter = router({
	hello: publicProcedure.input(z.string()).query(({ input }) => {
		return `Hello ${input}`;
	}),
});

export type AppRouter = typeof appRouter;

const app = new Hono();

app.use(
	"/api/trpc/*",
	trpcServer({
		endpoint: "/api/trpc",
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
