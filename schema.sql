CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
item_id INTEGER(11) AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price INTEGER(11) NOT NULL,
stock_quantity INTEGER(11) NOT NULL,
PRIMARY KEY (item_id)
);
  
SELECT * FROM products;



DELETE INTO products (item_id, product_name, department_name,price,stock_quantity)
VALUES (1,'bananas','food',2,100);

