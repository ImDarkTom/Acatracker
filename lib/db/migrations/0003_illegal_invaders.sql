ALTER TABLE `task` RENAME TO `assesment`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_assesment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`module` text NOT NULL,
	`due_at` integer NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_assesment`("id", "name", "description", "module", "due_at", "user_id", "created_at", "updated_at") SELECT "id", "name", "description", "module", "due_at", "user_id", "created_at", "updated_at" FROM `assesment`;--> statement-breakpoint
DROP TABLE `assesment`;--> statement-breakpoint
ALTER TABLE `__new_assesment` RENAME TO `assesment`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `module` ADD `code` text NOT NULL;