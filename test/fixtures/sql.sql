-- Abyssal SQL syntax highlighting fixture

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email
ON users(email);

INSERT INTO users (
    name,
    email,
    active
)
VALUES (
    'Alice',
    'alice@example.com',
    TRUE
);

SELECT
    id,
    name,
    email,
    active
FROM users
WHERE active = TRUE
ORDER BY created_at DESC
LIMIT 20;

SELECT
    u.name,
    COUNT(o.id) AS order_count,
    SUM(o.total) AS total_spent
FROM users AS u
LEFT JOIN orders AS o
    ON o.user_id = u.id
WHERE u.active = TRUE
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC;

UPDATE users
SET active = FALSE
WHERE id = 2;

DELETE FROM users
WHERE active = FALSE
  AND created_at < CURRENT_TIMESTAMP - INTERVAL '1 year';

WITH active_users AS (
    SELECT
        id,
        name,
        email
    FROM users
    WHERE active = TRUE
)
SELECT *
FROM active_users
WHERE name ILIKE '%alice%';