CREATE TABLE employee (
                          id_employee VARCHAR(10) PRIMARY KEY,
                          empl_surname VARCHAR(50) NOT NULL,
                          empl_name VARCHAR(50) NOT NULL,
                          empl_patronymic VARCHAR(50) NULL,
                          empl_role VARCHAR(10) NOT NULL,
                          salary DECIMAL(13,4) NOT NULL,
                          date_of_birth DATE NOT NULL,
                          date_of_start DATE NOT NULL,
                          phone_number VARCHAR(13) NOT NULL,
                          city VARCHAR(50) NOT NULL,
                          street VARCHAR(50) NOT NULL,
                          zip_code VARCHAR(9) NOT NULL,
                          password VARCHAR(50) NOT NULL
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
                         fk_category_number INT NOT NULL,
                         product_name VARCHAR(50) NOT NULL,
                         product_characteristics VARCHAR(100) NOT NULL,

                         FOREIGN KEY (fk_category_number) REFERENCES category (category_number)
                             ON UPDATE CASCADE ON DELETE NO ACTION
);
CREATE TABLE checks(
                       check_number VARCHAR(10) PRIMARY KEY,
                       fk_id_employee VARCHAR(10) NOT NULL,
                       fk_card_number VARCHAR(13) NULL,
                       print_date TIMESTAMP NOT NULL,
                       sum_total DECIMAL (13,4) NOT NULL,
                       vat DECIMAL (13,4) NOT NULL,
                       FOREIGN KEY (fk_id_employee) REFERENCES employee (id_employee)
                           ON UPDATE CASCADE ON DELETE NO ACTION,
                       FOREIGN KEY (fk_card_number) REFERENCES customer_card (card_number)
                           ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE store_product(
                              UPC VARCHAR(12) PRIMARY KEY,
                              fk_UPC_prom VARCHAR(12),
                              fk_id_product INT NOT NULL,
                              selling_price DECIMAL (13,4) NOT NULL,
                              product_number INT NOT NULL,
                              promotional_product BOOLEAN NOT NULL,
                              FOREIGN KEY (fk_UPC_prom) REFERENCES store_product (UPC)
                                  ON UPDATE CASCADE ON DELETE SET NULL,
                              FOREIGN KEY (fk_id_product) REFERENCES product (id_product)
                                  ON UPDATE CASCADE ON DELETE NO ACTION
);
CREATE TABLE sale(
                     fk_UPC VARCHAR(12),
                     fk_check_number VARCHAR(10),
                     product_number INT NOT NULL,
                     selling_price DECIMAL (13,4) NOT NULL,
                     PRIMARY KEY (fk_UPC, fk_check_number),
                     FOREIGN KEY (fk_UPC) REFERENCES store_product (UPC)
                         ON UPDATE CASCADE ON DELETE NO ACTION,
                     FOREIGN KEY (fk_check_number) REFERENCES checks (check_number)
                         ON UPDATE CASCADE ON DELETE CASCADE
);