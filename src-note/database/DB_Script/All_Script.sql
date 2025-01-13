-- user_roles
-- user (id, role_id ,name, username)
-- role (id ,name, code)
-- Role Manager
-- (1,  1, 'MGMT', 'manager0@gmial.com")
-- Role Cashier
-- (4,  4, "Cashier", "cashier01@gmail.com")
-- Role Table
-- 1
-- Admin
-- Admin
-- 2
-- Manager
-- Manager
-- 3
-- Account
-- Account
-- 4
-- Cashier
-- Cashier

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(4, 4);

-----------------------------------------------------

-- permissions Table
-- name group is_menu_web web_route_key
-- "product.get_list" "product" 1 "product" 

INSERT INTO `permissions` (`name`, `group`, `is_menu_web`, `web_route_key`) VALUES
-- Dashboard
('dashboard.get_list', 'dashboard', 1, '/dashboard'),
-- POS
('pos.get_list', 'pos', 1, '/pos'),
-- Customer
('customer.get_list', 'customer', 1, '/customer'),
('customer.get_one', 'customer', NULL, NULL),
('customer.create', 'customer', NULL, NULL),
('customer.update', 'customer', NULL, NULL),
('customer.remove', 'customer', NULL, NULL),
-- Order
('order.get_list', 'order', 1, '/order'),
-- Product 
('product.get_list', 'product', 1, '/product'),
('product.get_one', 'product', NULL, NULL),
('product.create', 'product', NULL, NULL),
('product.update', 'product', NULL, NULL),
('product.remove', 'product', NULL, NULL),
-- Category
('category.get_list', 'category', 1, '/category'),
('category.get_one', 'category', NULL, NULL),
('category.create', 'category', NULL, NULL),
('category.update', 'category', NULL, NULL),
('category.remove', 'category', NULL, NULL),
-- Purchase
('purchase.get_list', 'purchase', 1, '/purchase'),
('purchase.get_one', 'purchase', NULL, NULL),
('purchase.create', 'purchase', NULL, NULL),
('purchase.update', 'purchase', NULL, NULL),
('purchase.remove', 'purchase', NULL, NULL),
-- Supplier
('supplier.get_list', 'supplier', 1, '/supplier'),
('supplier.get_one', 'supplier', NULL, NULL),
('supplier.create', 'supplier', NULL, NULL),
('supplier.update', 'supplier', NULL, NULL),
('supplier.remove', 'supplier', NULL, NULL),
-- Expense
('expense.get_list', 'expense', 1, '/expense'),
('expense.get_one', 'expense', NULL, NULL),
('expense.create', 'expense', NULL, NULL),
('expense.update', 'expense', NULL, NULL),
('expense.remove', 'expense', NULL, NULL),
-- Expense Type
('expense_type.get_list', 'expense_type', 1, '/expense_type'),
('expense_type.get_one', 'expense_type', NULL, NULL),
('expense_type.create', 'expense_type', NULL, NULL),
('expense_type.update', 'expense_type', NULL, NULL),
('expense_type.remove', 'expense_type', NULL, NULL),
-- Employee
('employee.get_list', 'employee', 1, '/employee'),
('employee.get_one', 'employee', NULL, NULL),
('employee.create', 'employee', NULL, NULL),
('employee.update', 'employee', NULL, NULL),
('employee.remove', 'employee', NULL, NULL), 
-- User
('user.get_list', 'user', 1, '/user'),
('user.get_one', 'user', NULL, NULL),
('user.create', 'user', NULL, NULL),
('user.update', 'user', NULL, NULL),
('user.remove', 'user', NULL, NULL),
-- Role
('role.get_list', 'role', 1, '/role'),
('role.get_one', 'role', NULL, NULL),
('role.create', 'role', NULL, NULL),
('role.update', 'role', NULL, NULL),
('role.remove', 'role', NULL, NULL),
-- Setting
('setting.get_list', 'setting', 1, '/setting'),
('setting.get_one', 'setting', NULL, NULL),
('setting.create', 'setting', NULL, NULL),
('setting.update', 'setting', NULL, NULL),
('setting.remove', 'setting', NULL, NULL);

-- Report
('report.top_sale', 'report', 1, '/top_sale'),
('report.report_sale_summary', 'report', 1, '/report_sale_summary'),
('report.report_expense_summary', 'report', 1, '/report_expense_summary');

-- permission_roles Table
-- role_id ,permission_id 
INSERT INTO `permission_roles`(`role_id`, `permission_id`) 
VALUES 
-- Dashboard page
(1,1), 
-- POS page
(1,2), 
-- Customer page
(1,3), 
(1,4),
(1,5),
(1,6),
(1,7),
-- Order page
(1,8), 
(1,9),
-- Product page
(1,10), 
(1,11),
(1,12),
(1,13),
-- Category page
(1,14),
(1,15),
(1,16),
(1,17),
(1,18),
-- Purchase page
(1,19),
(1,20),
(1,21),
(1,22),
(1,23),
-- Supplier page
(1,24),
(1,25),
(1,26),
(1,27),
(1,28),
-- Expense page
(1,29),
(1,30),
(1,31),
(1,32),
(1,33),
-- Expense Type page
(1,34),
(1,35),
(1,36),
(1,37),
(1,38),
-- Employee page
(1,39),
(1,40),
(1,41),
(1,42),
(1,43),
-- User page
(1,44),
(1,45),
(1,46),
(1,47),
(1,48),
-- Role page
(1,49),
(1,50),
(1,51),
(1,52),
(1,53),
-- Top sale page
(1,54),
-- Report Sale Summary page
(1,55),
-- Report Expense Summary page
(1,56),
-- Setting page
(1,57),
(1,58),
(1,59),
(1,60),
(1,61);
------------------------------------------------------------------
INSERT INTO `permission_roles` (`role_id`, `permission_id`) VALUES
-- For Cashier User
(4,2), -- POS
(4,8), -- Order
(4,9);


-- Find Permission by user ID 
SELECT 
DISTINCT -- protect duplicate
	p.id,
    p.name,
    p.group,
    p.is_menu_web,
    p.web_route_key
FROM permissions AS p
INNER JOIN permission_roles AS pr on p.id = pr.permission_id
INNER JOIN role AS r on pr.role_id = r.id
INNER JOIN user_roles AS ur on r.id = ur.role_id
WHERE ur.user_id = 4;