INSERT INTO product_faqs (
    product_id,
    question,
    answer,
    status,
    created_at,
    updated_at
)
SELECT 
    new_ids.product_id,
    pf.question,
    pf.answer,
    pf.status,
    NOW(),
    NOW()
FROM product_faqs pf
JOIN (
    SELECT 9 AS product_id UNION ALL
    SELECT 64 UNION ALL
    SELECT 65 UNION ALL
    SELECT 66 
    
) new_ids
WHERE pf.product_id = 67;