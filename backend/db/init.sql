CREATE TABLE IF NOT EXISTS cabin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price INT
);

INSERT INTO cabin (name, price) VALUES
    ('Lake Cabin', 120),
    ('Forest Cabin', 90);