CREATE TABLE "words" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" varchar(255) NOT NULL,
	"definition" text NOT NULL,
	"examples" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "words_word_unique" UNIQUE("word")
);
