CREATE TABLE `monitor` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`slug` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`schedule` text NOT NULL,
	`grace_period` integer NOT NULL,
	`last_ping_at` integer,
	`status` text DEFAULT 'pending' NOT NULL
);
