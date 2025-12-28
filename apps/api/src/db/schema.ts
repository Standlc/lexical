import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const words = pgTable('words', {
	id: serial('id').primaryKey(),
	word: varchar('word', { length: 255 }).notNull().unique(),
	definition: text('definition').notNull(),
	examples: text('examples').array(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Word = typeof words.$inferSelect;
export type NewWord = typeof words.$inferInsert;
