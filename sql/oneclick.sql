/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.5.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: oneclick
-- ------------------------------------------------------
-- Server version	11.5.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES
(1,'Slaves');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Invoices`
--

DROP TABLE IF EXISTS `Invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Invoices` (
  `invoice_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `invoice_date` timestamp NULL DEFAULT current_timestamp(),
  `due_date` timestamp NULL DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `currency` char(3) NOT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `order_code` varchar(255) DEFAULT NULL,
  `invoice_pdf_url` varchar(255) DEFAULT NULL,
  `status` enum('issued','paid','cancelled') DEFAULT 'issued',
  PRIMARY KEY (`invoice_id`),
  KEY `order_id` (`order_id`),
  KEY `seller_id` (`seller_id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `Invoices_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `Invoices_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `Sellers` (`seller_id`) ON DELETE SET NULL,
  CONSTRAINT `Invoices_ibfk_3` FOREIGN KEY (`buyer_id`) REFERENCES `Buyers` (`buyer_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Invoices`
--

LOCK TABLES `Invoices` WRITE;
/*!40000 ALTER TABLE `Invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `Invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order_Items`
--

DROP TABLE IF EXISTS `Order_Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Order_Items` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `Order_Items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`),
  CONSTRAINT `Order_Items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order_Items`
--

LOCK TABLES `Order_Items` WRITE;
/*!40000 ALTER TABLE `Order_Items` DISABLE KEYS */;
INSERT INTO `Order_Items` VALUES
(1,1,1,2,20.00,40.00);
/*!40000 ALTER TABLE `Order_Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `seller_id` int(11) DEFAULT NULL,
  `order_date` timestamp NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `currency` char(3) NOT NULL,
  `order_status` enum('pending','confirmed','shipped','delivered','cancelled','returned') DEFAULT 'pending',
  `delivery_address` text DEFAULT NULL,
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `delivery_date` timestamp NULL DEFAULT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `Orders_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `Sellers` (`seller_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES
(1,1,'2024-09-09 01:54:49',100.00,'ETB','pending',NULL,'pending',NULL,NULL,NULL),
(6,1,'2024-09-17 01:44:29',16.50,'ETB','pending',NULL,'pending',NULL,'gXqtdOoBqv',NULL),
(7,1,'2024-09-17 01:44:29',16.50,'ETB','pending',NULL,'pending',NULL,'b3GLfdeQ1F',NULL),
(8,1,'2024-09-17 01:48:38',16.50,'ETB','pending',NULL,'pending',NULL,'G9615TXgii',NULL),
(9,1,'2024-09-17 01:48:38',16.50,'ETB','pending',NULL,'pending',NULL,'0WDTGmwEF0',NULL),
(10,1,'2024-09-17 01:50:26',16.50,'ETB','pending',NULL,'pending',NULL,'v0ZKUo51de',NULL),
(11,1,'2024-09-17 01:50:26',16.50,'ETB','pending',NULL,'pending',NULL,'LU878qjMHc',NULL),
(12,1,'2024-09-17 01:56:11',16.50,'ETB','pending',NULL,'pending',NULL,'OWQ8jnvohk',NULL),
(13,1,'2024-09-17 01:56:11',16.50,'ETB','pending',NULL,'pending',NULL,'PyVdA7UvW8',NULL),
(14,1,'2024-09-17 01:56:11',16.50,'ETB','pending',NULL,'pending',NULL,'CH2ENUoDfe',NULL),
(15,1,'2024-09-17 01:56:11',16.50,'ETB','pending',NULL,'pending',NULL,'FmFCz21ZMI',NULL),
(16,1,'2024-09-17 02:05:53',16.50,'ETB','pending',NULL,'pending',NULL,'hwNQ8FEH4C',NULL),
(17,1,'2024-09-17 02:05:53',16.50,'ETB','pending',NULL,'pending',NULL,'47CPoi8KdX',NULL),
(18,1,'2024-09-17 02:08:02',16.50,'ETB','pending',NULL,'pending',NULL,'rtQkIwH2Oq',NULL),
(19,1,'2024-09-17 02:08:02',16.50,'ETB','pending',NULL,'pending',NULL,'zMDSwxTMyt',NULL),
(20,1,'2024-09-17 10:08:09',51.00,'ETB','pending',NULL,'pending',NULL,'swOr4vUT0a',NULL),
(21,1,'2024-09-17 10:08:09',51.00,'ETB','pending',NULL,'pending',NULL,'kzxGDjk57E',NULL),
(22,1,'2024-09-18 09:20:56',39.50,'ETB','pending',NULL,'pending',NULL,'UabT3z5P0r',NULL),
(23,1,'2024-09-18 09:20:56',39.50,'ETB','pending',NULL,'pending',NULL,'KNnevJ8Zfr',NULL);
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payments`
--

DROP TABLE IF EXISTS `Payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Payments` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `payment_method` enum('mobile_banking','credit_card','debit_card','paypal') NOT NULL,
  `payment_date` timestamp NULL DEFAULT current_timestamp(),
  `amount` decimal(10,2) NOT NULL,
  `currency` char(3) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `confirmation_code` varchar(255) DEFAULT NULL,
  `payment_details` text DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `order_id` (`order_id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `Payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`),
  CONSTRAINT `Payments_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `Buyers` (`buyer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payments`
--

LOCK TABLES `Payments` WRITE;
/*!40000 ALTER TABLE `Payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `Payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `seller_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` char(3) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `product_images` text DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `last_updated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('active','inactive','out_of_stock') DEFAULT 'active',
  PRIMARY KEY (`product_id`),
  KEY `seller_id` (`seller_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `Sellers` (`seller_id`),
  CONSTRAINT `Products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES
(1,1,'Kousion','This is slave for sale',10.00,'ETB',10,1,NULL,'2024-09-09 01:59:47','2024-09-15 21:33:15','active'),
(7,NULL,'test','test',10.00,'ETB',2,1,NULL,'2024-09-15 22:20:07','2024-09-15 22:20:07','active'),
(8,NULL,'Kosuion','The daily slave',100.00,'ETB',10,1,NULL,'2024-09-15 22:22:01','2024-09-15 22:22:01','active'),
(9,1,'Kosuion2','The next slave',10.00,'ETB',20,1,NULL,'2024-09-15 22:23:16','2024-09-15 22:23:16','active'),
(10,1,'KKKK','This is a new slave',100.00,'ETB',10,1,NULL,'2024-09-16 02:09:07','2024-09-16 02:09:07','active'),
(12,1,'KosuionTest','This is yet another slave',10.00,'ETB',20,1,NULL,'2024-09-17 10:06:37','2024-09-17 10:06:37','active');
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sellers`
--

DROP TABLE IF EXISTS `Sellers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Sellers` (
  `seller_id` int(11) NOT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `business_address` text DEFAULT NULL,
  `bank_account_details` text DEFAULT NULL,
  `verification_status` enum('pending','verified','rejected') DEFAULT 'pending',
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_sales` decimal(10,2) DEFAULT 0.00,
  `date_joined` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`seller_id`),
  CONSTRAINT `Sellers_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sellers`
--

LOCK TABLES `Sellers` WRITE;
/*!40000 ALTER TABLE `Sellers` DISABLE KEYS */;
INSERT INTO `Sellers` VALUES
(1,'test','addis',NULL,'verified',NULL,0.00,0.00,'2024-09-09 01:54:12');
/*!40000 ALTER TABLE `Sellers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transactions`
--

DROP TABLE IF EXISTS `Transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Transactions` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `payment_id` int(11) DEFAULT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `transaction_type` enum('payment','refund','chargeback') NOT NULL,
  `transaction_date` timestamp NULL DEFAULT current_timestamp(),
  `amount` decimal(10,2) NOT NULL,
  `currency` char(3) NOT NULL,
  `status` enum('successful','pending','failed') DEFAULT 'pending',
  `details` text DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `payment_id` (`payment_id`),
  KEY `seller_id` (`seller_id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `Transactions_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `Payments` (`payment_id`),
  CONSTRAINT `Transactions_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `Sellers` (`seller_id`),
  CONSTRAINT `Transactions_ibfk_3` FOREIGN KEY (`buyer_id`) REFERENCES `Buyers` (`buyer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transactions`
--

LOCK TABLES `Transactions` WRITE;
/*!40000 ALTER TABLE `Transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `user_type` enum('buyer','seller','admin') NOT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES
(1,'test@gmail.com','$2a$10$KcQWJVZJr.65xiTx38QGhuWivm0uqWTdCqEA36Tv.we2qWc/l55Wa','test','end','0915949551','seller','2024-09-09 01:39:01',NULL,1);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2024-09-20 10:37:29
