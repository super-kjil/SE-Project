
----------------------------------------------------------

-- Sale by month Script
SELECT
    DATE_FORMAT(r.create_at, '%M') AS month,
    SUM(r.total_amount) AS total,
    COUNT(r.id) AS total_order
FROM `order` r
WHERE YEAR(r.create_at) = YEAR(CURRENT_DATE)
GROUP BY 
    MONTH(r.create_at), DATE_FORMAT(r.create_at, '%M')
ORDER BY 
    MONTH(r.create_at);

----------------------------------------------------------

-- Expense by month Script
SELECT
    DATE_FORMAT(expense_date, '%M') AS month,
    SUM(amount) AS total,
    COUNT(id) AS total_expense
FROM expense
WHERE YEAR(expense_date) = YEAR(CURRENT_DATE)
GROUP BY 
    MONTH(expense_date), DATE_FORMAT(expense_date, '%M')
ORDER BY 
    MONTH(expense_date);