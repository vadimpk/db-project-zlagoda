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
CREATE TABLE checks(
                       check_number VARCHAR(10) PRIMARY KEY,
                       FOREIGN KEY (id_employee) REFERENCES employee (id_employee)
                           ON UPDATE CASCADE ON DELETE NO ACTION
                           FOREIGN KEY (card_number) REFERENCES customer_card (card_number)
                           ON UPDATE CASCADE ON DELETE NO ACTION,
                       print_date TIMESTAMP NOT NULL,
                       sum_total DECIMAL (13,4) NOT NULL,
                       vat DECIMAL (13,4) NOT NULL
);
CREATE TABLE store_product(
                              UPC VARCHAR(12) PRIMARY KEY,
                              FOREIGN KEY (UPC_prom) REFERENCES store_product (UPC)
                                  ON UPDATE CASCADE ON DELETE SET NULL,
                              FOREIGN KEY (id_product) REFERENCES product (id_product)
                                  ON UPDATE CASCADE ON DELETE NO ACTION,
                              selling_price DECIMAL (13,4) NOT NULL,
                              product_number INT NOT NULL,
                              promotional_product BOOLEAN NOT NULL
);
CREATE TABLE sale(
                     FOREIGN KEY (UPC) REFERENCES store_product (UPC)
                         ON UPDATE CASCADE ON DELETE NO ACTION,
                     FOREIGN KEY (check_number) REFERENCES checks (check_number)
                         ON UPDATE CASCADE ON DELETE CASCADE,
                     product_number INT NOT NULL,
                     selling_price DECIMAL (13,4) NOT NULL,
                     PRIMARY KEY(UPC,check_number)
);

