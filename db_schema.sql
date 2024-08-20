CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES category(id),
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    cost NUMERIC(10, 2) NOT NULL
);

-- Insert categories
INSERT INTO category (name) VALUES ('Vegetables'), ('Fruits');

-- Insert products
INSERT INTO products (category_id, name, image, cost) VALUES
((SELECT id FROM category WHERE name = 'Vegetables'), 'Carrot', 'images/vegetables/carrot.jpg', 1.5),
((SELECT id FROM category WHERE name = 'Vegetables'), 'Broccoli', 'images/vegetables/broccoli.jpg', 2.0),
((SELECT id FROM category WHERE name = 'Vegetables'), 'Spinach', 'images/vegetables/spinach.jpg', 1.0),
((SELECT id FROM category WHERE name = 'Vegetables'), 'Potato', 'images/vegetables/potato.jpg', 0.8),
((SELECT id FROM category WHERE name = 'Vegetables'), 'Tomato', 'images/vegetables/tomato.jpg', 1.2),
((SELECT id FROM category WHERE name = 'Vegetables'), 'Cucumber', 'images/vegetables/cucumber.jpg', 1.1),

((SELECT id FROM category WHERE name = 'Fruits'), 'Apple', 'images/fruits/apple.jpg', 1.0),
((SELECT id FROM category WHERE name = 'Fruits'), 'Banana', 'images/fruits/banana.jpg', 0.5),
((SELECT id FROM category WHERE name = 'Fruits'), 'Orange', 'images/fruits/orange.jpg', 1.3),
((SELECT id FROM category WHERE name = 'Fruits'), 'Grapes', 'images/fruits/grapes.jpg', 2.0),
((SELECT id FROM category WHERE name = 'Fruits'), 'Strawberry', 'images/fruits/strawberry.jpg', 2.5),
((SELECT id FROM category WHERE name = 'Fruits'), 'Pineapple', 'images/fruits/pineapple.jpg', 3.0);