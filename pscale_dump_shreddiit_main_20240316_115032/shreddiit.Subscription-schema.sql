CREATE TABLE `Subscription` (
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subredditId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`userId`,`subredditId`),
  KEY `Subscription_subredditId_idx` (`subredditId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
