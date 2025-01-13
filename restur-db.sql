-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 06, 2025 at 07:52 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `description`, `status`, `parent_id`, `create_at`) VALUES
(1, 'Computer', 'Desc Computer', 1, 0, '2024-05-27 07:54:34'),
(2, 'Phone', 'Desc Phone', 1, 0, '2024-05-27 07:55:37'),
(3, 'Monitor', 'Desc Monitor', 1, 0, '2024-05-27 07:56:15'),
(5, 'LED', 'Desc LED', 1, 0, '2024-05-27 07:58:06');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `tel` varchar(18) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `type` varchar(120) DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `tel`, `email`, `address`, `type`, `create_by`, `create_at`) VALUES
(1, 'John Doe', '1234567890', 'johndoe@example.com', '123 Elm St, Springfield', 'Regular', 'Admin', '2024-11-01 18:14:46'),
(2, 'Jane Smith', '0987654321', 'janesmith@example.com', '456 Oak St, Springfield', 'Regular', 'Admin', '2024-11-01 18:14:46'),
(3, 'Alice Johnson', '5551234567', 'alicejohnson@example.com', '789 Pine St, Springfield', 'Premium', 'Admin', '2024-11-01 18:14:46'),
(4, 'Bob Brown', '5559876543', 'bobbrown@example.com', '321 Maple St, Springfield', 'Regular', 'Admin', '2024-11-01 18:14:46'),
(5, 'Charlie Green', '5551112222', 'charliegreen@example.com', '654 Birch St, Springfield', 'Premium', 'Admin', '2024-11-01 18:14:46'),
(7, 'Ethan Hunt', '5557778888', 'ethanhunt@example.com', '135 Willow St, Springfield', 'Premium', 'Admin', '2024-11-01 18:14:46'),
(8, 'Fiona Gallagher', '5552223333', 'fionagallagher@example.com', '246 Cherry St, Springfield', 'Regular', 'Admin', '2024-11-01 18:14:46'),
(9, 'George Costanza', '5554445555', 'georgecostanza@example.com', '357 Spruce St, Springfield', 'Regular', 'Admin', '2024-11-01 18:14:46'),
(10, 'Hannah Baker', '5556667777', 'hannahbaker@example.com', '468 Fir St, Springfield', 'Premium', 'Admin', '2024-11-01 18:14:46'),
(11, 'Dieb Puthy', '1223456789', 'diebputhy99@gmail.com', 'dsw', 'Premium', 'Admin 9505', '2024-11-01 20:08:45');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `firstname` varchar(120) NOT NULL,
  `lastname` varchar(120) NOT NULL,
  `dob` datetime NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `card_id` varchar(120) NOT NULL,
  `tel` varchar(18) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `position` varchar(120) DEFAULT NULL,
  `base_salary` decimal(6,2) NOT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `firstname`, `lastname`, `dob`, `gender`, `card_id`, `tel`, `email`, `address`, `position`, `base_salary`, `create_by`, `create_at`) VALUES
(1, 'Alice', 'Johnson', '1991-03-14 00:00:00', 0, 'CJ123456', '555-123-4567', 'alice.johnson@example.com', '123 Cherry Lane, Cityville', 'Sales Manager', 5200.00, 'HR', '2024-11-07 12:53:37'),
(2, 'Bob', 'Williams', '1987-08-22 00:00:00', 1, 'BJ789012', '555-234-5678', 'bob.williams@example.com', '456 Oak Ave, Townsville', 'IT Specialist', 4600.00, 'Admin', '2024-11-07 12:53:37'),
(3, 'Catherine', 'Brown', '1995-05-10 00:00:00', 0, 'CB345678', '555-345-6789', 'catherine.brown@example.com', '789 Pine St, Villagetown', 'Marketing Analyst', 4300.00, 'Marketing', '2024-11-07 12:53:37'),
(4, 'David', 'Taylor', '1983-11-18 00:00:00', 1, 'DT901234', '555-456-7890', 'david.taylor@example.com', '101 Maple St, Hamlet', 'Project Manager', 5000.00, 'HR', '2024-11-07 12:53:37'),
(5, 'Emma', 'Wilson', '1990-06-25 00:00:00', 0, 'EW567890', '555-567-8901', 'emma.wilson@example.com', '202 Birch St, Borough', 'Consultant', 4800.00, 'Consulting', '2024-11-07 12:53:37');

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `expense_type_id` int(11) DEFAULT NULL,
  `ref_no` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `amount` decimal(7,2) DEFAULT 0.00,
  `remark` text DEFAULT NULL,
  `expense_date` datetime DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`id`, `expense_type_id`, `ref_no`, `name`, `amount`, `remark`, `expense_date`, `create_by`, `create_at`) VALUES
(1, 1, 'EXP001', 'Business Trip', 5000.00, 'Travel expenses to client site', '2025-01-01 00:00:00', 'Admin', '2024-07-31 20:22:17'),
(2, 2, 'EXP002', 'Team Lunch', 150.00, 'Monthly team lunch', '2024-10-05 00:00:00', 'Admin', '2024-08-05 20:22:17'),
(3, 3, 'EXP003', 'Office Supplies', 75.50, 'Stationery purchase', '2024-10-10 00:00:00', 'Admin', '2024-09-03 20:22:17'),
(4, 4, 'EXP004', 'Electricity Bill', 2000.00, 'Office utility bill', '2025-02-14 00:00:00', 'Admin', '2024-09-11 20:22:17'),
(5, 5, 'EXP005', 'Social Media Ads', 3000.00, 'Marketing expense', '2025-03-07 00:00:00', 'Admin', '2024-10-14 20:22:17'),
(6, 6, 'EXP006', 'October Office Rent', 1000.00, 'Monthly rent for office', '2025-04-17 00:00:00', 'Admin', '2024-10-22 20:22:17'),
(7, 7, 'EXP007', 'A/C Repair', 120.00, 'Maintenance for office AC', '2024-10-10 00:00:00', 'Admin', '2024-11-01 20:22:17'),
(8, 8, 'EXP008', 'Online Course', 200.00, 'Training for staff', '2024-11-14 00:00:00', 'Admin', '2024-11-01 20:22:17'),
(9, 9, 'EXP009', 'General Liability Insurance', 25000.00, 'Insurance for office', '2025-02-19 00:00:00', 'Admin', '2024-11-01 20:22:17'),
(10, 10, 'EXP010', 'Miscellaneous Expenses', 50.00, 'Unexpected expenses', '2024-11-17 00:00:00', 'Admin', '2024-11-01 20:22:17');

-- --------------------------------------------------------

--
-- Table structure for table `expense_type`
--

CREATE TABLE `expense_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `expense_type`
--

INSERT INTO `expense_type` (`id`, `name`, `code`) VALUES
(1, 'Travel', 'TRV'),
(2, 'Meals', 'MLS'),
(3, 'Supplies', 'SUP'),
(4, 'Utilities', 'UTL'),
(5, 'Marketing', 'MKT'),
(6, 'Office Rent', 'RNT'),
(7, 'Maintenance', 'MTN'),
(8, 'Training', 'TRN'),
(9, 'Insurance', 'INS'),
(10, 'Miscellaneous', 'MSC');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `order_no` varchar(120) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_amount` decimal(6,0) NOT NULL DEFAULT 0,
  `paid_amount` decimal(7,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(120) NOT NULL,
  `remark` text DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `order_no`, `customer_id`, `user_id`, `total_amount`, `paid_amount`, `payment_method`, `remark`, `create_by`, `create_at`) VALUES
(6, 'INV-00001', 11, 8, 1260, 1260.03, 'ABA', NULL, 'Admin 9505', '2024-10-01 13:25:59'),
(7, 'INV-00007', 11, 8, 1260, 1260.03, 'ABA', NULL, 'Admin 9505', '2024-09-02 14:25:42'),
(8, 'INV-00008', 11, 8, 1260, 1260.03, 'ABA', NULL, 'Admin 9505', '2024-08-07 14:31:52'),
(9, 'INV-00009', 11, 8, 1260, 1260.03, 'ABA', NULL, 'Admin 9505', '2024-09-30 17:28:34'),
(10, 'INV-00010', 9, 8, 1260, 1260.03, 'ABA', NULL, 'Admin 9505', '2024-09-25 17:39:18'),
(11, 'INV-00011', 9, 8, 1260, 1260.03, 'Cash', NULL, 'Admin 9505', '2024-09-09 17:45:45'),
(12, 'INV-00012', 7, 8, 1260, 1260.03, 'AC', NULL, 'Admin 9505', '2024-09-27 17:49:30'),
(13, 'INV-00013', 1, 8, 1111, 1111.00, 'Cash', NULL, 'Admin 9505', '2024-11-23 17:51:39'),
(14, 'INV-00014', 1, 8, 1260, 1260.03, 'Cash', NULL, 'Admin 9505', '2024-11-23 17:55:20'),
(15, 'INV-00015', 8, 8, 1260, 1260.03, 'Cash', NULL, 'Admin 9505', '2024-11-23 17:56:01'),
(16, 'INV-00016', 2, 8, 1260, 1260.03, 'Wing', NULL, 'Admin 9505', '2024-11-24 15:50:42'),
(17, 'INV-00017', 11, 8, 1260, 1260.03, 'Cash', '1260.03', 'Admin 9505', '2024-12-04 13:53:07'),
(18, 'INV-00018', 1, 8, 3490, 3490.09, 'Cash', NULL, 'Admin', '2024-12-06 17:16:25'),
(19, 'INV-00019', 1, 8, 1111, 1111.00, 'Cash', 'test 13 12 24', 'Admin', '2024-12-12 17:36:46'),
(20, 'INV-00020', 1, 8, 1175, 1175.00, 'Cash', NULL, 'Admin', '2024-12-13 09:46:03'),
(21, 'INV-00021', 1, 8, 1175, 1175.00, 'Wing', NULL, 'Admin', '2024-12-13 09:47:22'),
(22, 'INV-00022', 1, 8, 1175, 1175.00, 'Cash', '', 'Admin', '2024-12-13 09:53:46'),
(23, 'INV-00023', 1, 8, 1175, 1175.00, 'Cash', '', 'Admin', '2024-12-13 09:54:29'),
(24, 'INV-00024', 1, 8, 1099, 1099.00, 'Wing', NULL, 'Admin', '2024-12-13 10:14:37'),
(25, 'INV-00025', 1, 8, 1099, 1099.00, 'Wing', NULL, 'Admin', '2024-12-13 10:16:29'),
(26, 'INV-00026', 1, 8, 1099, 1099.00, 'Wing', NULL, 'Admin', '2024-12-13 10:19:58'),
(27, 'INV-00027', 1, 8, 1099, 1111.00, 'Wing', NULL, 'Admin', '2024-12-13 10:20:54'),
(28, 'INV-00028', 1, 8, 1099, 0.00, 'Cash', NULL, 'Admin', '2024-12-13 10:22:44'),
(29, 'INV-00029', 1, 8, 1099, 112.00, 'Wing', NULL, 'Admin', '2024-12-13 10:24:16'),
(30, 'INV-00030', 1, 8, 1099, 112.00, 'Wing', NULL, 'Admin', '2024-12-13 10:24:16'),
(31, 'INV-00031', 2, 8, 1175, 1175.00, 'Wing', NULL, 'Admin', '2024-12-13 10:25:29'),
(32, 'INV-00032', 1, 8, 1111, 1111.00, 'Wing', NULL, 'Admin', '2024-12-13 10:26:43'),
(33, 'INV-00033', 1, 8, 1234, 1234.00, 'Wing', NULL, 'Admin', '2024-12-13 10:35:22'),
(34, 'INV-00034', 1, 8, 1234, 1234.00, 'Wing', NULL, 'Admin', '2024-12-13 10:36:29'),
(35, 'INV-00035', 1, 8, 1234, 1234.00, 'Wing', NULL, 'Admin', '2024-12-13 10:36:34'),
(36, 'INV-00036', 1, 8, 1234, 1235.00, 'Wing', NULL, 'Admin', '2024-12-13 10:36:41'),
(37, 'INV-00037', 1, 8, 1099, 1234.00, 'Wing', NULL, 'Admin', '2025-03-13 10:40:05'),
(38, 'INV-00038', 1, 1, 13248, 13248.00, 'Cash', NULL, 'MGMT', '2025-01-02 17:10:13'),
(39, 'INV-00039', 9, 1, 5659, 5659.04, 'Cash', NULL, 'MGMT', '2025-02-02 20:51:04'),
(40, 'INV-00040', 1, 1, 2598, 2598.00, 'Wing', NULL, 'MGMT', '2025-01-02 21:44:16');

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `proudct_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT 0,
  `price` decimal(7,2) DEFAULT 0.00,
  `discount` decimal(7,2) DEFAULT 0.00,
  `total` decimal(7,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`id`, `order_id`, `proudct_id`, `qty`, `price`, `discount`, `total`) VALUES
(1, 6, 35, 1, 1299.00, 3.00, 1260.03),
(2, 7, 35, 1, 1299.00, 3.00, 1260.03),
(3, 8, 35, 1, 1299.00, 3.00, 1260.03),
(4, 9, 35, 1, 1299.00, 3.00, 1260.03),
(5, 10, 35, 1, 1299.00, 3.00, 1260.03),
(6, 11, 35, 1, 1299.00, 3.00, 1260.03),
(7, 12, 35, 1, 1299.00, 3.00, 1260.03),
(8, 13, 33, 1, 1111.00, 0.00, 1111.00),
(9, 14, 35, 1, 1299.00, 3.00, 1260.03),
(10, 15, 35, 1, 1299.00, 3.00, 1260.03),
(11, 16, 35, 1, 1299.00, 3.00, 1260.03),
(12, 17, 35, 1, 1299.00, 3.00, 1260.03),
(13, 18, 35, 1, 1299.00, 3.00, 1260.03),
(14, 18, 36, 1, 1199.00, 2.00, 1175.02),
(15, 18, 34, 1, 1099.00, 4.00, 1055.04),
(16, 19, 33, 1, 1111.00, 0.00, 1111.00),
(17, 20, 36, 1, 1199.00, 2.00, 1175.02),
(18, 21, 36, 1, 1199.00, 2.00, 1175.02),
(19, 22, NULL, 1, 1199.00, 2.00, 1175.02),
(20, 23, NULL, 1, 1199.00, 2.00, 1175.02),
(21, 24, 34, 1, 1099.00, 0.00, 1099.00),
(22, 25, 34, 1, 1099.00, 0.00, 1099.00),
(23, 26, 34, 1, 1099.00, 0.00, 1099.00),
(24, 27, 34, 1, 1099.00, 0.00, 1099.00),
(25, 28, 34, 1, 1099.00, 0.00, 1099.00),
(26, 29, 34, 1, 1099.00, 0.00, 1099.00),
(27, 30, 34, 1, 1099.00, 0.00, 1099.00),
(28, 31, 36, 1, 1199.00, 2.00, 1175.02),
(29, 32, 33, 1, 1111.00, 0.00, 1111.00),
(30, 33, 31, 1, 1234.00, 0.00, 1234.00),
(31, 34, 31, 1, 1234.00, 0.00, 1234.00),
(32, 35, 31, 1, 1234.00, 0.00, 1234.00),
(33, 36, 31, 1, 1234.00, 0.00, 1234.00),
(34, 37, 34, 1, 1099.00, 0.00, 1099.00),
(35, 38, 34, 7, 1099.00, 0.00, 7693.00),
(36, 38, 33, 5, 1111.00, 0.00, 5555.00),
(37, 39, 34, 2, 1099.00, 0.00, 2198.00),
(38, 39, 36, 2, 1199.00, 2.00, 2350.04),
(39, 39, 33, 1, 1111.00, 0.00, 1111.00),
(40, 40, 35, 2, 1299.00, 0.00, 2598.00);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `is_menu_web` varchar(255) DEFAULT NULL,
  `web_route_key` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `group`, `is_menu_web`, `web_route_key`) VALUES
(1, 'dashboard.get_list', 'dashboard', '1', '/dashboard'),
(2, 'pos.get_list', 'pos', '1', '/pos'),
(3, 'customer.get_list', 'customer', '1', '/customer'),
(4, 'customer.get_one', 'customer', NULL, NULL),
(5, 'customer.create', 'customer', NULL, NULL),
(6, 'customer.update', 'customer', NULL, NULL),
(7, 'customer.remove', 'customer', NULL, NULL),
(8, 'order.get_list', 'order', '1', '/order'),
(9, 'product.get_list', 'product', '1', '/product'),
(10, 'product.get_one', 'product', NULL, NULL),
(11, 'product.create', 'product', NULL, NULL),
(12, 'product.update', 'product', NULL, NULL),
(13, 'product.remove', 'product', NULL, NULL),
(14, 'category.get_list', 'category', '1', '/category'),
(15, 'category.get_one', 'category', NULL, NULL),
(16, 'category.create', 'category', NULL, NULL),
(17, 'category.update', 'category', NULL, NULL),
(18, 'category.remove', 'category', NULL, NULL),
(19, 'purchase.get_list', 'purchase', '1', '/purchase'),
(20, 'purchase.get_one', 'purchase', NULL, NULL),
(21, 'purchase.create', 'purchase', NULL, NULL),
(22, 'purchase.update', 'purchase', NULL, NULL),
(23, 'purchase.remove', 'purchase', NULL, NULL),
(24, 'supplier.get_list', 'supplier', '1', '/supplier'),
(25, 'supplier.get_one', 'supplier', NULL, NULL),
(26, 'supplier.create', 'supplier', NULL, NULL),
(27, 'supplier.update', 'supplier', NULL, NULL),
(28, 'supplier.remove', 'supplier', NULL, NULL),
(29, 'expense.get_list', 'expense', '1', '/expense'),
(30, 'expense.get_one', 'expense', NULL, NULL),
(31, 'expense.create', 'expense', NULL, NULL),
(32, 'expense.update', 'expense', NULL, NULL),
(33, 'expense.remove', 'expense', NULL, NULL),
(34, 'expense_type.get_list', 'expense_type', '1', '/expense_type'),
(35, 'expense_type.get_one', 'expense_type', NULL, NULL),
(36, 'expense_type.create', 'expense_type', NULL, NULL),
(37, 'expense_type.update', 'expense_type', NULL, NULL),
(38, 'expense_type.remove', 'expense_type', NULL, NULL),
(39, 'employee.get_list', 'employee', '1', '/employee'),
(40, 'employee.get_one', 'employee', NULL, NULL),
(41, 'employee.create', 'employee', NULL, NULL),
(42, 'employee.update', 'employee', NULL, NULL),
(43, 'employee.remove', 'employee', NULL, NULL),
(44, 'user.get_list', 'user', '1', '/user'),
(45, 'user.get_one', 'user', NULL, NULL),
(46, 'user.create', 'user', NULL, NULL),
(47, 'user.update', 'user', NULL, NULL),
(48, 'user.remove', 'user', NULL, NULL),
(49, 'role.get_list', 'role', '1', '/role'),
(50, 'role.get_one', 'role', NULL, NULL),
(51, 'role.create', 'role', NULL, NULL),
(52, 'role.update', 'role', NULL, NULL),
(53, 'role.remove', 'role', NULL, NULL),
(54, 'report.top_sale', 'report', '1', '/top_sale'),
(55, 'report.report_sale_summary', 'report', '1', '/report_sale_summary'),
(56, 'report.report_expense_summary', 'report', '1', '/report_expense_summary'),
(57, 'setting.get_list', 'setting', '1', '/setting'),
(58, 'setting.get_one', 'setting', NULL, NULL),
(59, 'setting.create', 'setting', NULL, NULL),
(60, 'setting.update', 'setting', NULL, NULL),
(61, 'setting.remove', 'setting', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permission_roles`
--

CREATE TABLE `permission_roles` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permission_roles`
--

INSERT INTO `permission_roles` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 36),
(1, 37),
(1, 38),
(1, 39),
(1, 40),
(1, 41),
(1, 42),
(1, 43),
(1, 44),
(1, 45),
(1, 46),
(1, 47),
(1, 48),
(1, 49),
(1, 50),
(1, 51),
(1, 52),
(1, 53),
(1, 54),
(1, 55),
(1, 56),
(1, 57),
(1, 58),
(1, 59),
(1, 60),
(1, 61),
(4, 2),
(4, 8),
(4, 9);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `barcode` varchar(120) NOT NULL,
  `name` varchar(120) NOT NULL,
  `brand` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `qty` int(11) NOT NULL DEFAULT 0,
  `price` decimal(7,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(3,2) NOT NULL,
  `status` tinyint(1) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `category_id`, `barcode`, `name`, `brand`, `description`, `qty`, `price`, `discount`, `status`, `image`, `create_by`, `create_at`) VALUES
(31, 1, 'P031', 'MacBoook Pro M3 ', 'Apple', 'dddd', 8, 1234.00, 0.00, 1, 'upload_image-1735993538971-949825488', 'Admin 9505', '2024-11-16 10:03:21'),
(32, 1, 'P032', 'MacBoook Pro M3', 'Apple', 'eeee', 12, 1111.00, 0.00, 1, 'upload_image-1735993509230-40819816', 'Admin 9505', '2024-11-16 10:03:50'),
(33, 1, 'P033', 'MacBoook Pro', 'Apple', 'aaaaa', 102, 1111.00, 0.00, 1, 'upload_image-1735993486519-470625427', 'Admin 9505', '2024-11-16 10:04:35'),
(34, 1, 'P034', 'DELL XPS 16 2024', 'Dell', 'CPU i9-14 | RAM 16 | SSD 1TB', 204, 1099.00, 0.00, 1, 'upload_image-1735993476405-546110975', 'Admin 9505', '2024-11-17 13:36:49'),
(35, 1, 'P035', 'MacBoook Pro M3 ', 'Apple', 'RAM 16GB | SSD 512GB ', 10, 1299.00, 0.00, 1, 'upload_image-1735993468641-766819191', 'Admin 9505', '2024-11-17 13:37:39'),
(36, 1, 'P036', 'DELL XPS 16 2024', 'Dell', 'CPU I9-14 | SSD 512 | RAM 16', 6, 1199.00, 2.00, 1, 'upload_image-1735998786676-172502013', 'Admin 9505', '2024-12-05 14:51:38'),
(37, 1, 'P037', 'LENOVO ThinkPad ', 'Lenovo', 'RAM 16GB | SSD 512GB ', 23, 1232.00, 0.00, 1, 'upload_image-1736061151063-174636807', 'MGMT', '2025-01-05 07:12:31');

-- --------------------------------------------------------

--
-- Table structure for table `product_image`
--

CREATE TABLE `product_image` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `product_image`
--

INSERT INTO `product_image` (`id`, `product_id`, `image`) VALUES
(5, 28, 'upload_image_optional-1731073703332-485203047'),
(6, 29, 'upload_image_optional-1731680734444-786147130'),
(7, 29, 'upload_image_optional-1731680734445-506944055'),
(8, 29, 'upload_image_optional-1731680734447-294654848'),
(9, 35, 'upload_image_optional-1732259580613-521077159'),
(10, 35, 'upload_image_optional-1732259580613-830044581'),
(11, 35, 'upload_image_optional-1732259580615-725594629'),
(12, 34, 'upload_image_optional-1732260934685-317486204'),
(13, 34, 'upload_image_optional-1732260934685-621028830'),
(14, 34, 'upload_image_optional-1732260934686-687372133');

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `ref` varchar(255) NOT NULL,
  `shipp_company` varchar(255) DEFAULT NULL,
  `shipp_cost` decimal(7,2) DEFAULT 0.00,
  `paid_amount` decimal(7,2) DEFAULT 0.00,
  `paid_date` datetime DEFAULT NULL,
  `status` varchar(120) DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_product`
--

CREATE TABLE `purchase_product` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT 0,
  `cost` decimal(7,2) DEFAULT 0.00,
  `discount` decimal(7,2) DEFAULT 0.00,
  `amount` decimal(7,2) DEFAULT 0.00,
  `retail_price` decimal(7,2) DEFAULT 0.00,
  `remark` text DEFAULT NULL,
  `status` varchar(120) DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `code` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `code`) VALUES
(1, 'Admin', 'Admin'),
(2, 'Manager', 'Manager'),
(3, 'Account', 'Account'),
(4, 'Cashier', 'Cashier');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `id` int(11) NOT NULL,
  `name` varchar(18) NOT NULL,
  `code` varchar(18) NOT NULL,
  `tel` varchar(18) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website` varchar(120) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`id`, `name`, `code`, `tel`, `email`, `address`, `website`, `note`, `create_by`, `create_at`) VALUES
(1, 'VN-101', 'VN-101', '096998861', 'vn101@gmail.com', '#23 st23 HN', 'vn101.com', '', 'Admin NIT', '2024-10-08 14:12:31'),
(5, 'VN-102', 'VN-102', '0988888881', 'vn102@gmail.com', '#24 St12', 'vn102.com', NULL, 'Admin NIT', '2024-10-09 14:17:35'),
(6, 'VN-113', 'VN-103', '0988888882', 'vn103@outlook.com', '#123 st 34', 'vn103', '', 'Admin NIT', '2024-10-09 14:18:15'),
(7, 'TH', 'TH-001', '098765432', 'th001@gmail.com', 'bangkok', 'th001@bangkok', NULL, 'Admin 9505', '2024-11-01 17:24:56');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `name` varchar(120) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `role_id`, `name`, `username`, `password`, `is_active`, `create_by`, `create_at`, `image`) VALUES
(1, 1, 'MGMT', 'manager0@gmial.com', '$2b$10$MjHo6eC2y1GXL6dj1VTx8OXGCaAlS1dNsHKXvRJfdQ7BAg2Hyhaa2', 1, 'Admin', '2024-12-16 14:04:47', 'upload_image-1736075736802-614368082'),
(3, 4, 'So Sreyna', 'soksreyna@gmail.com', '$2b$10$ZsZI/nn2eviE/2BWl.0mpupWaf4QvXzrNLsVwTQnTz.zNsxrwtDrK', 1, 'Admin NIT', '2024-09-19 14:13:00', 'upload_image-1736075835267-596339714'),
(4, 4, 'Cashier', 'cashier01@gmail.com', '$2b$10$ZOmRPq2dXpKazVkrXceaieS/h1fecRPxBgryfCvedWsMvLrWIXxki', 1, 'Admin 9505', '2024-11-01 08:30:42', 'upload_image-1736097106418-913215270'),
(8, 1, 'Admin', 'admin9505@gmial.com', '$2b$10$mbW0jyme6juh72eAWnRjluyAu3trH5JJgWJezo7ks.haxwEqXwKLm', 1, '\r\nAdmin', '2024-10-25 17:01:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1),
(4, 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tel` (`tel`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tel` (`tel`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_type_id` (`expense_type_id`);

--
-- Indexes for table `expense_type`
--
ALTER TABLE `expense_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `proudct_id` (`proudct_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permission_roles`
--
ALTER TABLE `permission_roles`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `p_barcode` (`barcode`);

--
-- Indexes for table `product_image`
--
ALTER TABLE `product_image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `purchase_product`
--
ALTER TABLE `purchase_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `tel` (`tel`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `expense_type`
--
ALTER TABLE `expense_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `product_image`
--
ALTER TABLE `product_image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_product`
--
ALTER TABLE `purchase_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_type` (`id`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  ADD CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`proudct_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `permission_roles`
--
ALTER TABLE `permission_roles`
  ADD CONSTRAINT `permission_roles_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permission_roles_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`);

--
-- Constraints for table `purchase_product`
--
ALTER TABLE `purchase_product`
  ADD CONSTRAINT `purchase_product_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`id`),
  ADD CONSTRAINT `purchase_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
