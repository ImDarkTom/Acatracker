ALTER TABLE `assesment` RENAME TO `assessment`;--> statement-breakpoint
ALTER TABLE `task` RENAME COLUMN "assesment" TO "assessment";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_assessment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`module` integer NOT NULL,
	`released_at` integer,
	`due_at` integer NOT NULL,
	`completed` integer,
	`user_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`module`) REFERENCES `module`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_assessment`("id", "name", "slug", "description", "module", "released_at", "due_at", "completed", "user_id", "created_at", "updated_at") SELECT "id", "name", "slug", "description", "module", "released_at", "due_at", "completed", "user_id", "created_at", "updated_at" FROM `assessment`;--> statement-breakpoint
DROP TABLE `assessment`;--> statement-breakpoint
ALTER TABLE `__new_assessment` RENAME TO `assessment`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `assessment_slug_unique` ON `assessment` (`slug`);--> statement-breakpoint
ALTER TABLE `task` ALTER COLUMN "assessment" TO "assessment" integer NOT NULL REFERENCES assessment(id) ON DELETE no action ON UPDATE no action;