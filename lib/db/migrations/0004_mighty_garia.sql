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
	FOREIGN KEY (`module`) REFERENCES `module`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_assessment`("id", "name", "slug", "description", "module", "released_at", "due_at", "completed", "user_id", "created_at", "updated_at") SELECT "id", "name", "slug", "description", "module", "released_at", "due_at", "completed", "user_id", "created_at", "updated_at" FROM `assessment`;--> statement-breakpoint
DROP TABLE `assessment`;--> statement-breakpoint
ALTER TABLE `__new_assessment` RENAME TO `assessment`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `assessment_slug_unique` ON `assessment` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_module` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`year` integer NOT NULL,
	`semester` integer NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_module`("id", "name", "code", "year", "semester", "user_id", "created_at", "updated_at") SELECT "id", "name", "code", "year", "semester", "user_id", "created_at", "updated_at" FROM `module`;--> statement-breakpoint
DROP TABLE `module`;--> statement-breakpoint
ALTER TABLE `__new_module` RENAME TO `module`;--> statement-breakpoint
CREATE UNIQUE INDEX `module_code_userId_unique` ON `module` (`code`,`user_id`);--> statement-breakpoint
CREATE TABLE `__new_task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`assessment` integer NOT NULL,
	`due_at` integer NOT NULL,
	`completed` integer,
	`user_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`assessment`) REFERENCES `assessment`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_task`("id", "name", "description", "assessment", "due_at", "completed", "user_id", "created_at", "updated_at") SELECT "id", "name", "description", "assessment", "due_at", "completed", "user_id", "created_at", "updated_at" FROM `task`;--> statement-breakpoint
DROP TABLE `task`;--> statement-breakpoint
ALTER TABLE `__new_task` RENAME TO `task`;--> statement-breakpoint
CREATE TABLE `__new_calendarToken` (
	`user_id` integer NOT NULL,
	`calendar_token` text NOT NULL,
	PRIMARY KEY(`user_id`, `calendar_token`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_calendarToken`("user_id", "calendar_token") SELECT "user_id", "calendar_token" FROM `calendarToken`;--> statement-breakpoint
DROP TABLE `calendarToken`;--> statement-breakpoint
ALTER TABLE `__new_calendarToken` RENAME TO `calendarToken`;--> statement-breakpoint
CREATE UNIQUE INDEX `calendarToken_userId_unique` ON `calendarToken` (`user_id`);