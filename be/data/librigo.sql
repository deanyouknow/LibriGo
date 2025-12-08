-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Dec 08, 2025 at 01:54 AM
-- Server version: 8.0.44
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `librigo`
--
CREATE DATABASE IF NOT EXISTS `librigo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `librigo`;

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `book_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(100) NOT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `description` text,
  `cover_image` varchar(255) DEFAULT NULL,
  `status` enum('available','borrowed') DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `title`, `author`, `isbn`, `description`, `cover_image`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Laskar Pelangi', 'Andrea Hirata', '9780000000001', 'Novel tentang perjuangan anak-anak Belitung', NULL, 'available', '2025-11-22 16:38:05', '2025-11-22 17:22:02'),
(2, 'Bumi Manusia', 'Pramoedya Ananta Toer', '9780000000002', 'Tetralogi Buru pertama', NULL, 'available', '2025-11-22 16:38:05', '2025-11-22 16:38:05'),
(3, 'Filosofi Kopi', 'Dee Lestari', '9780000000003', 'Kumpulan cerpen tentang kopi dan kehidupan', NULL, 'borrowed', '2025-11-22 16:38:05', '2025-11-22 16:38:05'),
(4, 'Perahu Kertas', 'Dee Lestari', '9780000000004', 'Novel romantis tentang cinta dan mimpi', NULL, 'available', '2025-11-22 16:38:05', '2025-11-22 16:38:05'),
(5, 'Negeri 5 Menara', 'Ahmad Fuadi', '9780000000005', 'Kisah santri di pesantren Madani', NULL, 'available', '2025-11-22 16:38:05', '2025-11-22 16:38:05'),
(6, 'Cantik Itu Luka', 'Eka Kurniawan', '9780000000011', 'Novel satire magis berlatar Halimunda', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(7, 'Seperti Dendam, Rindu Harus Dibayar Tuntas', 'Eka Kurniawan', '9780000000012', 'Kisah keras penuh humor gelap dan cinta', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(8, 'Orang-Orang Biasa', 'Andrea Hirata', '9780000000013', 'Kisah humor dan perjuangan sekelompok sahabat', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(9, 'Ronggeng Dukuh Paruk', 'Ahmad Tohari', '9780000000014', 'Trilogi klasik tentang Srintil dan Dukuh Paruk', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(10, 'Saman', 'Ayu Utami', '9780000000015', 'Novel kontroversial yang mengangkat isu sosial-politik', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(11, 'Supernova: Kesatria, Putri, dan Bintang Jatuh', 'Dee Lestari', '9780000000016', 'Buku pertama dari seri Supernova', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(12, 'Ksatria, Kecapi, dan Bunga', 'Tere Liye', '9780000000017', 'Novel fantasi dengan tema petualangan dan moral', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(13, 'Pulang', 'Tere Liye', '9780000000018', 'Kisah keluarga, mafia, dan perjalanan pulang', '', 'borrowed', '2025-11-22 17:36:25', '2025-11-22 20:01:32'),
(14, 'Tentang Kamu', 'Tere Liye', '9780000000019', 'Kisah penyelidikan kehidupan seorang wanita misterius', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(15, 'Gadis Kretek', 'Ratih Kumala', '9780000000020', 'Novel sejarah tentang industri kretek Indonesia', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(16, 'To Kill a Mockingbird', 'Harper Lee', '9780000000021', 'Klasik tentang keadilan dan moral di Amerika Selatan', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(17, '1984', 'George Orwell', '9780000000022', 'Novel distopia tentang totalitarianisme', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(18, 'The Great Gatsby', 'F. Scott Fitzgerald', '9780000000023', 'Kisah tragedi dan mimpi Amerika era 1920-an', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(19, 'Pride and Prejudice', 'Jane Austen', '9780000000024', 'Novel romantis klasik tentang cinta dan kelas sosial', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(20, 'The Alchemist', 'Paulo Coelho', '9780000000025', 'Fabel spiritual tentang mengejar takdir', NULL, 'available', '2025-11-22 17:36:25', '2025-11-24 06:13:47'),
(21, 'The Catcher in the Rye', 'J.D. Salinger', '9780000000026', 'Kisah coming-of-age dari sudut pandang Holden Caulfield', NULL, 'available', '2025-11-22 17:36:25', '2025-11-24 06:40:17'),
(22, 'Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', '9780000000027', 'Awal petualangan Harry Potter di Hogwarts', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 19:57:54'),
(23, 'The Hobbit', 'J.R.R. Tolkien', '9780000000028', 'Petualangan Bilbo Baggins menuju Lonely Mountain', NULL, 'available', '2025-11-22 17:36:25', '2025-11-22 17:36:25'),
(24, 'The Da Vinci Code', 'Dan Brown', '9780000000029', 'Thriller misteri tentang simbol dan konspirasi', NULL, 'borrowed', '2025-11-22 17:36:25', '2025-11-24 06:52:19'),
(25, 'The Little Prince', 'Antoine de Saint-Exupéry', '9780000000030', 'Fabel filosofis tentang seorang pangeran kecil', NULL, 'available', '2025-11-22 17:36:25', '2025-11-24 06:36:01');

-- --------------------------------------------------------

--
-- Table structure for table `borrowings`
--

DROP TABLE IF EXISTS `borrowings`;
CREATE TABLE `borrowings` (
  `borrowing_id` int NOT NULL,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `borrow_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `return_date` timestamp NULL DEFAULT NULL,
  `status` enum('borrowed','returned') DEFAULT 'borrowed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `borrowings`
--

INSERT INTO `borrowings` (`borrowing_id`, `user_id`, `book_id`, `borrow_date`, `return_date`, `status`) VALUES
(1, 2, 1, '2025-11-22 17:21:44', '2025-11-22 17:22:01', 'returned'),
(2, 3, 22, '2025-11-22 17:37:20', '2025-11-22 19:56:28', 'returned'),
(3, 1, 13, '2025-11-22 19:56:50', NULL, 'borrowed'),
(4, 3, 22, '2025-11-22 19:57:33', '2025-11-22 19:57:54', 'returned'),
(5, 6, 20, '2025-11-24 06:13:28', '2025-11-24 06:13:47', 'returned'),
(6, 6, 25, '2025-11-24 06:35:40', '2025-11-24 06:36:01', 'returned'),
(7, 6, 21, '2025-11-24 06:40:10', '2025-11-24 06:40:17', 'returned'),
(8, 2, 24, '2025-11-24 06:52:19', NULL, 'borrowed');

-- --------------------------------------------------------

--
-- Table structure for table `borrowing_requests`
--

DROP TABLE IF EXISTS `borrowing_requests`;
CREATE TABLE `borrowing_requests` (
  `request_id` int NOT NULL,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `request_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `borrowing_requests`
--

INSERT INTO `borrowing_requests` (`request_id`, `user_id`, `book_id`, `request_date`, `status`) VALUES
(1, 2, 1, '2025-11-22 17:21:00', 'approved'),
(2, 3, 22, '2025-11-22 17:37:13', 'approved'),
(3, 1, 13, '2025-11-22 19:56:44', 'approved'),
(4, 3, 22, '2025-11-22 19:57:29', 'approved'),
(5, 2, 14, '2025-11-24 01:52:44', 'rejected'),
(6, 5, 25, '2025-11-24 05:36:40', 'rejected'),
(7, 6, 24, '2025-11-24 05:47:06', 'rejected'),
(8, 6, 20, '2025-11-24 05:48:11', 'approved'),
(9, 6, 25, '2025-11-24 06:12:56', 'rejected'),
(10, 6, 24, '2025-11-24 06:13:04', 'rejected'),
(11, 6, 25, '2025-11-24 06:35:30', 'approved'),
(12, 6, 25, '2025-11-24 06:37:06', 'rejected'),
(13, 6, 21, '2025-11-24 06:40:04', 'approved'),
(14, 6, 25, '2025-11-24 06:46:33', 'rejected'),
(15, 2, 25, '2025-11-24 06:46:54', 'rejected'),
(16, 2, 24, '2025-11-24 06:52:11', 'approved'),
(17, 2, 22, '2025-11-24 06:52:39', 'rejected'),
(18, 6, 22, '2025-11-24 06:52:47', 'rejected'),
(19, 2, 22, '2025-11-24 07:00:35', 'pending'),
(20, 6, 22, '2025-11-24 07:00:40', 'rejected'),
(21, 2, 21, '2025-11-24 07:18:31', 'rejected'),
(22, 6, 22, '2025-11-24 07:27:32', 'pending'),
(23, 6, 25, '2025-11-24 07:36:59', 'pending'),
(24, 2, 25, '2025-11-25 02:51:59', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `registration_codes`
--

DROP TABLE IF EXISTS `registration_codes`;
CREATE TABLE `registration_codes` (
  `code_id` int NOT NULL,
  `code` varchar(20) NOT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `used_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `registration_codes`
--

INSERT INTO `registration_codes` (`code_id`, `code`, `is_used`, `used_by`, `created_at`) VALUES
(1, '2025', 0, NULL, '2025-11-22 16:38:05'),
(2, 'DAFTARUSER', 0, NULL, '2025-11-22 16:38:05'),
(3, 'ngopi', 0, NULL, '2025-11-22 17:32:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', '$2b$10$9wvhOnlYskuPPgEskh.Yz./MKMgunPBdCnLASc39ctfqcMxFadMqq', 'admin', '2025-11-22 16:46:31'),
(2, 'wongireng', '$2b$10$1/9HXPu6MX5d7a2hj6pe1uucJJbIcKxi.IvnTQhAvdCwer4Lr30gS', 'user', '2025-11-22 17:00:24'),
(3, 'espresso', '$2b$10$pWrW26RdeXk2YnMaYMeCrOGDmm5vCApXDhXAwgPoL5zSv0rhKQZjy', 'user', '2025-11-22 17:26:43'),
(4, 'jawa', '$2b$10$HI8LevIdWDTyI5xtBxBB3.V5eDSkgCYUQwQ1GvzCx3qreYPtfHEzy', 'user', '2025-11-24 01:37:11'),
(5, 'nama123', '$2b$10$u6S1ZsU.rqdsLNmq5vANeuFvKyRn6F7wvfmvFao2OWCBRE413BjnC', 'user', '2025-11-24 05:36:20'),
(6, 'akunbaru', '$2b$10$kf0yYSeMebETdJc2X4CKVuO139LJCvldsoNzaztEe3Dt4u6Ikme4K', 'user', '2025-11-24 05:43:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`),
  ADD UNIQUE KEY `isbn` (`isbn`),
  ADD KEY `idx_book_status` (`status`);

--
-- Indexes for table `borrowings`
--
ALTER TABLE `borrowings`
  ADD PRIMARY KEY (`borrowing_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `idx_borrowing_status` (`status`);

--
-- Indexes for table `borrowing_requests`
--
ALTER TABLE `borrowing_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `idx_request_status` (`status`);

--
-- Indexes for table `registration_codes`
--
ALTER TABLE `registration_codes`
  ADD PRIMARY KEY (`code_id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `used_by` (`used_by`),
  ADD KEY `idx_reg_code` (`code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_user_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `borrowings`
--
ALTER TABLE `borrowings`
  MODIFY `borrowing_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `borrowing_requests`
--
ALTER TABLE `borrowing_requests`
  MODIFY `request_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `registration_codes`
--
ALTER TABLE `registration_codes`
  MODIFY `code_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrowings`
--
ALTER TABLE `borrowings`
  ADD CONSTRAINT `borrowings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `borrowings_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE;

--
-- Constraints for table `borrowing_requests`
--
ALTER TABLE `borrowing_requests`
  ADD CONSTRAINT `borrowing_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `borrowing_requests_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE;

--
-- Constraints for table `registration_codes`
--
ALTER TABLE `registration_codes`
  ADD CONSTRAINT `registration_codes_ibfk_1` FOREIGN KEY (`used_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
