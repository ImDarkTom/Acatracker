CREATE TABLE `userPreferences` (
	`user_id` integer NOT NULL,
	`total_years` integer DEFAULT 4 NOT NULL,
	`semesters_per_year` integer DEFAULT 2 NOT NULL,
	`current_year` integer DEFAULT 1 NOT NULL,
	`current_semester` integer DEFAULT 1 NOT NULL,
	`week_starts_on` integer DEFAULT 1 NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
