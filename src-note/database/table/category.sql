SELECT 
p.*,
c.name AS category_name
FROM product p
INNER JOIN category c ON p.category_id = c.id
