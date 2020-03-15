CREATE TABLE `users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` TEXT NOT NULL,
	`login` VARCHAR(50) NOT NULL,
	`password` TEXT NOT NULL,
	`email` TEXT DEFAULT NULL,
	`recToken` TEXT DEFAULT NULL,
	CONSTRAINT `uniqueLogin` UNIQUE(`login`)
);

CREATE TABLE `coordenadas` (
	`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`login` TEXT NOT NULL,
	`latitude` TEXT NOT NULL,
	`longitude` TEXT NOT NULL,
	`hour` TEXT,
);

CREATE TABLE `autorizados` (
	`id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`master_id` INT(11) NOT NULL,
	`slave_id` INT(11) NOT NULL,
	CONSTRAINT `unique_ms` UNIQUE(`master_id`,`slave_id`),
	CONSTRAINT `fk_masterUser` FOREIGN KEY (`master_id`) REFERENCES `users` (`id`),
	CONSTRAINT `fk_slaveUser` FOREIGN KEY (`slave_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `esp8266` (
	`serial_number` INT(11) NOT NULL AUTO_INCREMENT,
	`user` VARCHAR(50) NULL DEFAULT NULL,
	PRIMARY KEY (`serial_number`),
	INDEX `FK__users` (`user`),
	CONSTRAINT `FK__users` FOREIGN KEY (`user`) REFERENCES `users` (`login`)
);