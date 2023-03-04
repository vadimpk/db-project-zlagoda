CREATE TABLE employee (
                          id_employee VARCHAR(10) PRIMARY KEY,
                          empl_surname VARCHAR(50) NOT NULL,
                          empl_name VARCHAR(50) NOT NULL,
                          empl_patronymic VARCHAR(50) NULL,
                          empl_role VARCHAR(10) NOT NULL,
                          salary DECIMAL(13,4) NO NULL,
                          date_of_birth DATE NOT NULL,
                          date_of_start DATE NOT NULL,
                          phone_number VARCHAR(13) NOT NULL,
                          city VARCHAR(50) NOT NULL,
                          street VARCHAR(50) NOT NULL,
                          zip_code VARCHAR(9) NOT NULL
);
CREATE TABLE category (
                          category_number INT PRIMARY KEY,
                          category_name VARCHAR(50) NOT NULL
);
CREATE TABLE customer_card(
                              card_number VARCHAR(13) PRIMARY KEY,
                              cust_surname VARCHAR(50) NOT NULL,
                              cust_name VARCHAR(50) NOT NULL,
                              cust_patronymic VARCHAR(50) NULL,
                              phone_number VARCHAR(13) NOT NULL,
                              city VARCHAR(50) NOT NULL,
                              street VARCHAR(50) NOT NULL,
                              zip_code VARCHAR(9) NOT NULL,
                              discount INT NOT NULL
);
CREATE TABLE product (
                         id_product INT PRIMARY KEY,
                         FOREIGN KEY (category_name) REFERENCES category (category_number)
                             ON UPDATE CASCADE ON DELETE NO ACTION,

                         product_name VARCHAR(50) NOT NULL,
                         product_characteristics VARCHAR(100) NOT NULL
);
CREATE TABLE check(
                      check_number VARCHAR(10) PRIMARY KEY,
                      FOREIGN KEY (category_name) REFERENCES category (category_number)
                          ON UPDATE CASCADE ON DELETE NO ACTION

)