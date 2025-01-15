-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 14, 2025 at 02:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `click_block_tech`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `AdminID` char(13) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(100) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `DateOfBirth` date NOT NULL,
  `LoginPin` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`AdminID`, `LastName`, `FirstName`, `PhoneNumber`, `Address`, `Email`, `DateOfBirth`, `LoginPin`) VALUES
('3288841753', 'Keletso', 'Talane', '076534578', '123 Main Street, Cityville, ST 12345', 'KeletsoTalane.doe@example.com', '1990-01-01', '$2a$10$yt.PyjnSF26zKbjOk778Tuky3OAfblxOK7F9qHwVdTEagF2VUSR5W'),
('9174733038', 'Ezra', 'Baleni', '0604526783', '123 Main Street, Cityville, ST 12345', 'EzraBaleni.doe@example.com', '1990-01-01', '$2a$10$OHlIE8OZMlF8ZVo/rE5gQuuL2uzZC25MRE2MZrkyC8gjIpS.oOh3u');

-- --------------------------------------------------------

--
-- Table structure for table `alert`
--

CREATE TABLE `alert` (
  `AlertID` int(11) NOT NULL,
  `CustID_Nr` char(13) NOT NULL,
  `AlertType` varchar(50) NOT NULL,
  `SentDate` date NOT NULL,
  `LocationID` int(11) NOT NULL,
  `Receiver` varchar(255) NOT NULL,
  `Message` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alert`
--

INSERT INTO `alert` (`AlertID`, `CustID_Nr`, `AlertType`, `SentDate`, `LocationID`, `Receiver`, `Message`) VALUES
(1234567898, '9703245939087', 'PanicAlert', '2024-11-29', 7, 'Admin', 'Alert button is triggered');

-- --------------------------------------------------------

--
-- Table structure for table `alertpinlogs`
--

CREATE TABLE `alertpinlogs` (
  `LogID` int(11) NOT NULL,
  `CustID_Nr` char(13) NOT NULL,
  `TriggerDate` datetime DEFAULT current_timestamp(),
  `Action` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alertpinlogs`
--

INSERT INTO `alertpinlogs` (`LogID`, `CustID_Nr`, `TriggerDate`, `Action`) VALUES
(5, '8203025652084', '2024-11-23 17:39:33', 'Alert Triggered'),
(6, '9403025087088', '2024-11-23 17:42:35', 'Alert Triggered'),
(7, '0301013570082', '2024-11-28 20:19:20', 'Alert Triggered'),
(8, '0301013570082', '2024-11-28 20:52:15', 'Alert Triggered'),
(9, '0301013570082', '2024-11-28 21:01:37', 'Alert Triggered'),
(10, '9703245939087', '2024-11-29 11:37:21', 'Alert Triggered');

-- --------------------------------------------------------

--
-- Table structure for table `bankaccount`
--

CREATE TABLE `bankaccount` (
  `AccountID` int(11) NOT NULL,
  `AccountNr` varchar(10) NOT NULL,
  `ExpirationDate` date DEFAULT NULL,
  `AccountType` varchar(50) NOT NULL,
  `Balance` decimal(10,2) NOT NULL,
  `CreationDate` date NOT NULL,
  `isActive` tinyint(4) NOT NULL,
  `LastModified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `RestorationCount` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bankaccount`
--

INSERT INTO `bankaccount` (`AccountID`, `AccountNr`, `ExpirationDate`, `AccountType`, `Balance`, `CreationDate`, `isActive`, `LastModified`, `RestorationCount`) VALUES
(5, '1731970803', '2031-11-19', 'Savings', 5570.83, '2024-11-19', 1, '2024-11-28 20:57:10', 1),
(6, '1731971109', '2031-11-19', 'Savings', 1058.50, '2024-11-19', 1, '2024-11-28 14:35:06', 0),
(7, '1731971310', '2031-11-19', 'Savings', 0.00, '2024-11-19', 0, '2024-11-18 23:35:15', 0),
(8, '1731971447', '2031-11-19', 'Savings', 0.00, '2024-11-19', 1, '2024-11-18 23:10:47', 0),
(10, '1732872381', '2031-11-29', 'Savings', 400.00, '2024-11-29', 0, '2024-11-29 09:36:57', 0);

-- --------------------------------------------------------

--
-- Table structure for table `bankcard`
--

CREATE TABLE `bankcard` (
  `CardID` int(11) NOT NULL,
  `AccountID` int(11) NOT NULL,
  `CardNumber` varchar(16) NOT NULL,
  `CardType` varchar(50) NOT NULL,
  `ExpirationDate` date NOT NULL,
  `CVV` varchar(3) NOT NULL,
  `IsActive` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bankcard`
--

INSERT INTO `bankcard` (`CardID`, `AccountID`, `CardNumber`, `CardType`, `ExpirationDate`, `CVV`, `IsActive`) VALUES
(5, 5, '5478434791209107', 'debit', '2025-11-18', '494', 1),
(6, 6, '5478864953928026', 'debit', '2027-11-18', '693', 1),
(7, 7, '5478995619569719', 'debit', '2027-11-18', '401', 1),
(8, 8, '5478847681250517', 'debit', '2027-11-18', '405', 1),
(10, 10, '5478285219298618', 'debit', '2029-11-28', '623', 1);

-- --------------------------------------------------------

--
-- Table structure for table `contactmemessage`
--

CREATE TABLE `contactmemessage` (
  `MessageID` int(11) NOT NULL,
  `CustID_Nr` char(13) NOT NULL,
  `FullNames` varchar(100) NOT NULL,
  `PhoneNumber` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `MessageDescription` varchar(255) DEFAULT NULL,
  `Status` varchar(10) NOT NULL,
  `AdminID` char(13) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contactmemessage`
--

INSERT INTO `contactmemessage` (`MessageID`, `CustID_Nr`, `FullNames`, `PhoneNumber`, `Email`, `MessageDescription`, `Status`, `AdminID`) VALUES
(4, '0301013570082', 'Mpho Manaka', '0799800273', 'MphoManaka@gmail.com', 'Can\'t Log In .', 'Pending', '3288841753'),
(5, '8203025652084', 'Aviwe Baleni', '0799800273', 'AviweBaleni@gmail.com', 'Can\'t Log In .', 'Pending', '3288841753'),
(6, '8203025652084', 'Aviwe Baleni', '0799800273', 'AviweBaleni@gmail.com', 'App Not Working.', 'Pending', '3288841753'),
(7, '0301013570082', 'Mpho Manaka', '0763542678', 'MphoManaka@gmail.com', 'Gfg', 'pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `CustID_Nr` char(13) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Email` varchar(100) NOT NULL,
  `DateOfBirth` date NOT NULL,
  `LoginPin` varchar(255) NOT NULL,
  `AlertPin` varchar(255) NOT NULL,
  `isVerified` tinyint(1) NOT NULL,
  `PanicButtonStatus` tinyint(1) NOT NULL,
  `AccountID` int(11) DEFAULT NULL,
  `LastLogin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`CustID_Nr`, `LastName`, `FirstName`, `PhoneNumber`, `Address`, `Email`, `DateOfBirth`, `LoginPin`, `AlertPin`, `isVerified`, `PanicButtonStatus`, `AccountID`, `LastLogin`) VALUES
('0301013570082', 'Manaka', 'Mpho', '0763542678', '123 Main St', 'MphoManaka@gmail.com', '2003-01-01', '$2a$10$X6T5a7ybwZT8VcFFWpmDH.bYVqBjSA5I8Xc0ipbq4Df5DOxVfWO4q', '$2a$10$mLhPMenhMa3OjrXZWH0qve52EUcJj24F7zbQcxohJDp3AgKdZpqAe', 0, 1, 5, '2024-12-09 11:57:05'),
('0603028511088', 'Sithole', 'Ntsako', '07998736527', '123 Main St', 'NtsakoSithole@gmail.com', '2006-03-02', '$2a$10$4N7zkuA33ZbsvmTYkfo3Ge9FXZz7ULHh8vsMUCR8TlYNNZZxYBL7e', '', 0, 0, 7, '2024-11-21 10:03:04'),
('8203025652084', 'Baleni', 'Aviwe', '0799088376', '123 Main St', 'AviweBaleni@gmail.com', '1982-03-02', '$2a$10$1iO9SBvM8ulBktPafnWR6.48/r2fPHa2Ax2cl2I5vqaSpcofLEVHm', '', 0, 0, 8, '2024-11-20 10:03:14'),
('9403025087088', 'Mkha', 'Akhona', '0635728926', '123 Main St', 'AkhonaMK@gmail.com', '1994-03-02', '$2a$10$SMJ5n78eb9ay/clyTs8duuoSsrOOp4hGP4ptRhcJPbpce0H2URn8W', '', 0, 0, 6, '2024-11-23 15:52:39'),
('9703245939087', 'Masedi', 'Akhona', '0730852365', 'Polokwane, Polokwane, za, 0825', 'Akhonakhaya@gmail.com', '1997-03-24', '$2a$10$9w.AgFeAxqe/T2NzB4R.UuC0h.7QzVxIbcLfKeGKGQgaQHsjFaztC', '$2a$10$wQioHJUVW7qJltdpLikKHuITesG1PuO/LiZn/VfUKw7z0VziDHHJC', 0, 1, 10, '2024-12-12 08:55:08');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `LocationID` int(11) NOT NULL,
  `StreetAddress` varchar(255) NOT NULL,
  `Suburb` varchar(100) DEFAULT NULL,
  `City` varchar(100) NOT NULL,
  `Province` varchar(100) NOT NULL,
  `PostalCode` varchar(10) DEFAULT NULL,
  `Country` varchar(100) NOT NULL DEFAULT 'South Africa',
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`LocationID`, `StreetAddress`, `Suburb`, `City`, `Province`, `PostalCode`, `Country`, `latitude`, `longitude`) VALUES
(7, 'Unnamed Road, Mountain View, CA 94043, USA', 'Santa Clara County', 'Mountain View', 'California', '94043', 'United States', '37.4220936', '-122.083922');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `NotificationID` int(11) NOT NULL,
  `TransactionID` int(11) NOT NULL,
  `NotificationType` varchar(50) NOT NULL,
  `SentDate` date NOT NULL,
  `Status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`NotificationID`, `TransactionID`, `NotificationType`, `SentDate`, `Status`) VALUES
(71, 62, 'Widthdrawal', '2024-11-29', 'approved'),
(72, 63, 'Widthdrawal', '2024-11-29', 'declined'),
(73, 64, 'Widthdrawal', '2024-11-29', 'declined'),
(74, 65, 'Widthdrawal', '2025-01-14', 'declined'),
(75, 66, 'Widthdrawal', '2025-01-14', 'declined');

-- --------------------------------------------------------

--
-- Table structure for table `supportingdocument`
--

CREATE TABLE `supportingdocument` (
  `SuppDocsID` int(11) NOT NULL,
  `CustID_Nr` char(13) NOT NULL,
  `ID_Document` varchar(255) NOT NULL,
  `Selfie_With_ID` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supportingdocument`
--

INSERT INTO `supportingdocument` (`SuppDocsID`, `CustID_Nr`, `ID_Document`, `Selfie_With_ID`) VALUES
(2, '9703245939087', 'ID_Document-1732872447328-868417645.pdf', 'Selfie_With_ID-1732872447350-980390999.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `TransactionID` int(11) NOT NULL,
  `AccountID` int(11) NOT NULL,
  `TransactionType` varchar(50) NOT NULL,
  `TransactionDate` date NOT NULL,
  `TransactionAmount` decimal(10,2) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `IsPanicTrigered` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`TransactionID`, `AccountID`, `TransactionType`, `TransactionDate`, `TransactionAmount`, `Status`, `IsPanicTrigered`) VALUES
(62, 10, 'Widthdrawal', '2024-11-29', 100.00, 'approved', 0),
(63, 10, 'Widthdrawal', '2024-11-29', 200.00, 'declined', 0),
(64, 10, 'Widthdrawal', '2024-11-29', 300.00, 'declined', 1),
(65, 5, 'Widthdrawal', '2025-01-14', 20.00, 'declined', 0),
(66, 5, 'Widthdrawal', '2025-01-14', 20.00, 'declined', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`AdminID`);

--
-- Indexes for table `alert`
--
ALTER TABLE `alert`
  ADD PRIMARY KEY (`AlertID`),
  ADD KEY `CustID_Nr` (`CustID_Nr`),
  ADD KEY `LocationID` (`LocationID`);

--
-- Indexes for table `alertpinlogs`
--
ALTER TABLE `alertpinlogs`
  ADD PRIMARY KEY (`LogID`),
  ADD KEY `CustID_Nr` (`CustID_Nr`);

--
-- Indexes for table `bankaccount`
--
ALTER TABLE `bankaccount`
  ADD PRIMARY KEY (`AccountID`),
  ADD UNIQUE KEY `AccountNr` (`AccountNr`);

--
-- Indexes for table `bankcard`
--
ALTER TABLE `bankcard`
  ADD PRIMARY KEY (`CardID`),
  ADD KEY `AccountID` (`AccountID`);

--
-- Indexes for table `contactmemessage`
--
ALTER TABLE `contactmemessage`
  ADD PRIMARY KEY (`MessageID`),
  ADD KEY `AdminID` (`AdminID`),
  ADD KEY `CustID_Nr` (`CustID_Nr`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`CustID_Nr`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `AccountID` (`AccountID`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`LocationID`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`NotificationID`),
  ADD KEY `TransactionID` (`TransactionID`);

--
-- Indexes for table `supportingdocument`
--
ALTER TABLE `supportingdocument`
  ADD PRIMARY KEY (`SuppDocsID`),
  ADD KEY `CustID_Nr` (`CustID_Nr`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `AccountID` (`AccountID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alert`
--
ALTER TABLE `alert`
  MODIFY `AlertID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1234567899;

--
-- AUTO_INCREMENT for table `alertpinlogs`
--
ALTER TABLE `alertpinlogs`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bankaccount`
--
ALTER TABLE `bankaccount`
  MODIFY `AccountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bankcard`
--
ALTER TABLE `bankcard`
  MODIFY `CardID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contactmemessage`
--
ALTER TABLE `contactmemessage`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `LocationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `NotificationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `supportingdocument`
--
ALTER TABLE `supportingdocument`
  MODIFY `SuppDocsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alert`
--
ALTER TABLE `alert`
  ADD CONSTRAINT `alert_ibfk_1` FOREIGN KEY (`CustID_Nr`) REFERENCES `customer` (`CustID_Nr`),
  ADD CONSTRAINT `alert_ibfk_2` FOREIGN KEY (`LocationID`) REFERENCES `location` (`LocationID`);

--
-- Constraints for table `alertpinlogs`
--
ALTER TABLE `alertpinlogs`
  ADD CONSTRAINT `alertpinlogs_ibfk_1` FOREIGN KEY (`CustID_Nr`) REFERENCES `customer` (`CustID_Nr`);

--
-- Constraints for table `bankcard`
--
ALTER TABLE `bankcard`
  ADD CONSTRAINT `bankcard_ibfk_1` FOREIGN KEY (`AccountID`) REFERENCES `bankaccount` (`AccountID`);

--
-- Constraints for table `contactmemessage`
--
ALTER TABLE `contactmemessage`
  ADD CONSTRAINT `contactmemessage_ibfk_1` FOREIGN KEY (`AdminID`) REFERENCES `admin` (`AdminID`),
  ADD CONSTRAINT `contactmemessage_ibfk_2` FOREIGN KEY (`CustID_Nr`) REFERENCES `customer` (`CustID_Nr`);

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`AccountID`) REFERENCES `bankaccount` (`AccountID`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`TransactionID`) REFERENCES `transaction` (`TransactionID`);

--
-- Constraints for table `supportingdocument`
--
ALTER TABLE `supportingdocument`
  ADD CONSTRAINT `supportingdocument_ibfk_1` FOREIGN KEY (`CustID_Nr`) REFERENCES `customer` (`CustID_Nr`);

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`AccountID`) REFERENCES `bankaccount` (`AccountID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
