CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"user_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"items" text NOT NULL,
	"total_cost" real NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
