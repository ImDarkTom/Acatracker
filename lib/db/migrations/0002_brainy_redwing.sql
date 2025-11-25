CREATE TABLE `calendarToken` (
	`user_id` integer NOT NULL,
	`calendar_token` text NOT NULL,
	PRIMARY KEY(`user_id`, `calendar_token`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `calendarToken_userId_unique` ON `calendarToken` (`user_id`);