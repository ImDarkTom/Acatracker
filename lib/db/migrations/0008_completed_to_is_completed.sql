ALTER TABLE `assessment` RENAME COLUMN "completed" TO "is_completed";--> statement-breakpoint
ALTER TABLE `task` RENAME COLUMN "completed" TO "is_completed";--> statement-breakpoint
ALTER TABLE `task` RENAME COLUMN "assessment" TO "assessment_id";--> statement-breakpoint
ALTER TABLE `task` ALTER COLUMN "assessment_id" TO "assessment_id" integer NOT NULL REFERENCES assessment(id) ON DELETE cascade ON UPDATE no action;