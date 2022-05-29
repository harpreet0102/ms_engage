CREATE TABLE `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `refresh_token` text COLLATE utf8_unicode_ci,
  `role` enum('ADMIN','USER') COLLATE utf8_unicode_ci DEFAULT 'USER',
  PRIMARY KEY (`userId`)
) 

CREATE TABLE `posts` (
  `postId` int(11) NOT NULL AUTO_INCREMENT,
  `description` text COLLATE utf8_unicode_ci,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`postId`)
) 