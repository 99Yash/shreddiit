CREATE TABLE `Vote` (
  `postId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `voteType` enum('UP','DOWN') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`postId`,`userId`),
  KEY `Vote_postId_idx` (`postId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
