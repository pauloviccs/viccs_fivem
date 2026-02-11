CREATE TABLE IF NOT EXISTS `phone_contacts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `identifier` varchar(60) DEFAULT NULL,
    `name` varchar(50) DEFAULT NULL,
    `number` varchar(50) DEFAULT NULL,
    `avatar` varchar(255) DEFAULT 'default_avatar.png',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `phone_messages` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `sender` varchar(50) DEFAULT NULL,
    `receiver` varchar(50) DEFAULT NULL,
    `message` text DEFAULT NULL,
    `date` timestamp NOT NULL DEFAULT current_timestamp(),
    `isRead` int(11) DEFAULT 0,
    `conversation_id` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `phone_gallery` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `identifier` varchar(60) DEFAULT NULL,
    `image` varchar(255) DEFAULT NULL,
    `date` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Instagram Cloned Tables
CREATE TABLE IF NOT EXISTS `instagram_accounts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `identifier` varchar(60) DEFAULT NULL,
    `username` varchar(50) DEFAULT NULL,
    `password` varchar(255) DEFAULT NULL,
    `avatar` varchar(255) DEFAULT 'default.png',
    `bio` varchar(255) DEFAULT NULL,
    `verified` int(11) DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `instagram_posts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `account_id` int(11) DEFAULT NULL,
    `image` varchar(255) DEFAULT NULL,
    `caption` varchar(255) DEFAULT NULL,
    `likes` int(11) DEFAULT 0,
    `date` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `instagram_likes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `post_id` int(11) DEFAULT NULL,
    `account_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `instagram_comments` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `post_id` int(11) DEFAULT NULL,
    `account_id` int(11) DEFAULT NULL,
    `comment` text DEFAULT NULL,
    `date` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `instagram_stories` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `account_id` int(11) DEFAULT NULL,
    `image` varchar(255) DEFAULT NULL,
    `date` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `phone_settings`;
CREATE TABLE IF NOT EXISTS `phone_settings` (
    `citizenid` varchar(50) NOT NULL,
    `key` varchar(50) NOT NULL,
    `value` text DEFAULT NULL,
    PRIMARY KEY (`citizenid`, `key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
