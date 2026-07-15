ALTER TABLE `monitor` RENAME COLUMN `schedule` TO `schedule_s`;--> statement-breakpoint
ALTER TABLE `monitor` RENAME COLUMN `grace_period` TO `grace_period_s`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_monitor` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`slug` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`schedule_s` integer NOT NULL,
	`grace_period_s` integer NOT NULL,
	`last_ping_at` integer,
	`status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_monitor`(`id`, `slug`, `name`, `schedule_s`, `grace_period_s`, `last_ping_at`, `status`) SELECT `id`, `slug`, `name`, `schedule_s`, `grace_period_s`, `last_ping_at`, `status` FROM `monitor`;--> statement-breakpoint
DROP TABLE `monitor`;--> statement-breakpoint
ALTER TABLE `__new_monitor` RENAME TO `monitor`;--> statement-breakpoint
PRAGMA foreign_keys=ON;