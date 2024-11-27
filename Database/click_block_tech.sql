-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 13, 2024 at 09:05 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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

-- --------------------------------------------------------

--
-- Table structure for table `alert`
--

CREATE TABLE `alert` (
  `AlertID` int(11) NOT NULL,
  `CustID_Nr` char(13) NOT NULL,
  `AlertType` varchar(50) NOT NULL,
  `SentDate` timestamp NOT NULL,
  `LocationID` int(11) NOT NULL,
  `Receiver` varchar(255) NOT NULL,
  `Message` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

 `LastModified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `RestorationCount` INT DEFAULT 0


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
   `LastLogin` DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `IsPanicTrigered` tinyint(1) DEFAULT NULL,
  `LocationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD KEY `AccountID` (`AccountID`),
  ADD KEY `LocationID` (`LocationID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alert`
--
ALTER TABLE `alert`
  MODIFY `AlertID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `alertpinlogs`
--
ALTER TABLE `alertpinlogs`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bankaccount`
--
ALTER TABLE `bankaccount`
  MODIFY `AccountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bankcard`
--
ALTER TABLE `bankcard`
  MODIFY `CardID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contactmemessage`
--
ALTER TABLE `contactmemessage`
  MODIFY `MessageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `LocationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `NotificationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supportingdocument`
--
ALTER TABLE `supportingdocument`
  MODIFY `SuppDocsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123456790;

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
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`AccountID`) REFERENCES `bankaccount` (`AccountID`),
  ADD CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`LocationID`) REFERENCES `location` (`LocationID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
