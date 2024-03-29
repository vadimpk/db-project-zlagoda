package storage

import (
	"database/sql"
	"fmt"
	"github.com/apsdehal/go-logger"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/internal/service"
)

type statisticsStorage struct {
	logger *logger.Logger
	db     *sql.DB
}

func NewStatisticsStorage(logger *logger.Logger, db *sql.DB) service.StatisticsStorage {
	return &statisticsStorage{
		logger: logger,
		db:     db,
	}
}

var _ service.StatisticsService = (*statisticsStorage)(nil)

func (s *statisticsStorage) GetSalesByCategory(opts *service.GetSalesByCategoryOptions) ([]*entity.CategorySale, error) {
	var dateFilter string
	var args []interface{}
	if opts.StartDate != nil && opts.EndDate != nil {
		dateFilter = "WHERE ch.print_date BETWEEN $1 AND $2 "
		args = append(args, opts.StartDate, opts.EndDate)
	}

	query := fmt.Sprintf(`
SELECT
    c.category_number,
    c.category_name,
    COUNT(DISTINCT s.fk_check_number) AS total_sales,
    AVG(cc.discount) AS avg_discount,
    SUM(s.product_number) AS total_products_sold,
    AVG(s.selling_price) AS avg_selling_price
FROM
    sale s
JOIN
    checks ch ON s.fk_check_number = ch.check_number
JOIN
    store_product sp ON s.fk_UPC = sp.UPC
JOIN
    product p ON sp.fk_id_product = p.id_product
JOIN
    category c ON p.fk_category_number = c.category_number
LEFT JOIN
    customer_card cc ON ch.fk_card_number = cc.card_number
 %s
GROUP BY
    c.category_number, c.category_name
ORDER BY
    total_sales DESC, c.category_number;
`, dateFilter)

	s.logger.Infof("executing query: %s", query)
	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*entity.CategorySale
	for rows.Next() {
		var sale entity.CategorySale
		err := rows.Scan(
			&sale.CategoryNumber,
			&sale.CategoryName,
			&sale.TotalSales,
			&sale.AvgDiscount,
			&sale.TotalProductsSold,
			&sale.AvgSellingPrice,
		)
		if err != nil {
			return nil, err
		}
		results = append(results, &sale)
	}

	return results, nil
}

func (s *statisticsStorage) GetEmployeesChecks(opts *service.GetEmployeesChecksOptions) ([]*entity.EmployeeCheck, error) {
	var dateFilter string
	var args []interface{}
	if opts.StartDate != nil && opts.EndDate != nil {
		dateFilter = "AND ch.print_date BETWEEN $1 AND $2 "
		args = append(args, opts.StartDate, opts.EndDate)
	}

	query := fmt.Sprintf(`
SELECT
    e.id_employee,
    e.empl_surname,
    e.empl_name,
    COUNT(ch.check_number) AS check_count,
    SUM(ch.sum_total) AS total_price,
    AVG(ch.sum_total) AS avg_check_price,
    SUM(ch.sum_total * cc.discount / 100) AS total_discount,
    COUNT(DISTINCT ch.fk_card_number) AS different_customers
FROM
    employee e
JOIN
    checks ch ON e.id_employee = ch.fk_id_employee
LEFT JOIN
    customer_card cc ON ch.fk_card_number = cc.card_number
WHERE
    e.empl_role = 'Касир'
 %s
GROUP BY
    e.id_employee, e.empl_surname, e.empl_name
ORDER BY
    check_count DESC;
`, dateFilter)

	s.logger.Infof("executing query: %s", query)
	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*entity.EmployeeCheck
	for rows.Next() {
		var check entity.EmployeeCheck
		err := rows.Scan(
			&check.IdEmployee,
			&check.EmplSurname,
			&check.EmplName,
			&check.CheckCount,
			&check.TotalCheckPrice,
			&check.AverageCheckPrice,
			&check.TotalDiscount,
			&check.DifferentCustomers,
		)
		if err != nil {
			return nil, err
		}
		results = append(results, &check)
	}

	return results, nil
}

func (s *statisticsStorage) GetCustomersBuyAllCategories(opts *service.GetCustomersBuyAllCategoriesOptions) ([]*entity.CustomerBuyAllCategories, error) {
	var dateFilter string
	var args []interface{}
	if opts.StartDate != nil && opts.EndDate != nil {
		dateFilter = "AND ch.print_date BETWEEN $1 AND $2 "
		args = append(args, opts.StartDate, opts.EndDate)
	}

	query := fmt.Sprintf(`SELECT DISTINCT
    cc.card_number,
    cc.cust_surname,
    cc.cust_name,
    cc.cust_patronymic
FROM
    customer_card cc
WHERE
    NOT EXISTS (
        SELECT
            c.category_number
        FROM
            category c
        WHERE
            NOT EXISTS (
                SELECT
                    1
                FROM
                    sale s
                JOIN checks ch ON s.fk_check_number = ch.check_number
                JOIN store_product sp ON s.fk_UPC = sp.UPC
                JOIN product p ON sp.fk_id_product = p.id_product
                WHERE
                    ch.fk_card_number = cc.card_number
                    AND p.fk_category_number = c.category_number
                    %s
            )
    );
 `, dateFilter)
	s.logger.Infof("executing query: %s", query)
	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*entity.CustomerBuyAllCategories
	for rows.Next() {
		var customer entity.CustomerBuyAllCategories
		err := rows.Scan(
			&customer.CustomerCardID,
			&customer.CustomerName,
			&customer.CustomerSurname,
			&customer.CustomerPatr,
		)
		if err != nil {
			return nil, err
		}
		results = append(results, &customer)
	}
	return results, nil
}

func (s *statisticsStorage) GetCustomersChecks(opts *service.GetCustomersChecksOptions) ([]*entity.CustomerCheck, error) {
	var dateFilter string
	var args []interface{}
	if opts.StartDate != nil && opts.EndDate != nil {
		dateFilter = "WHERE ch.print_date BETWEEN $1 AND $2 "
		args = append(args, opts.StartDate, opts.EndDate)
	}

	query := fmt.Sprintf(`
 	SELECT c.card_number AS customer_id,
     c.cust_surname,
     c.cust_name,
     c.cust_patronymic,
     COUNT(ch.check_number) AS check_count,
     AVG(ch.sum_total) AS avg_check_price,
     SUM(ch.sum_total) AS total_check_amount
 	FROM customer_card c
 	LEFT JOIN checks ch ON c.card_number = ch.fk_card_number
 	%s
 	GROUP BY c.card_number, c.cust_surname, c.cust_name, c.cust_patronymic;
 `, dateFilter)
	s.logger.Infof("executing query: %s", query)
	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*entity.CustomerCheck
	for rows.Next() {
		var customer entity.CustomerCheck
		err := rows.Scan(
			&customer.CustomerID,
			&customer.CustomerSurname,
			&customer.CustomerName,
			&customer.CustomerPatr,
			&customer.CheckCount,
			&customer.TotalCheckPrice,
			&customer.AverageCheckPrice,
		)
		if err != nil {
			return nil, err
		}
		results = append(results, &customer)

	}
	return results, nil
}

func (s *statisticsStorage) GetEmployeesWithNoChecks(opts *service.GetEmployeesWithNoChecksOptions) ([]*entity.Employee, error) {
	var dateFilter string
	var args []interface{}
	if opts.StartDate != nil && opts.EndDate != nil {
		dateFilter = "AND ch.print_date BETWEEN $1 AND $2 "
		args = append(args, opts.StartDate, opts.EndDate)
	}

	query := fmt.Sprintf(`
SELECT
    *
FROM
    employee e
WHERE
    NOT EXISTS (
        SELECT 1
        FROM checks ch
        WHERE
            e.id_employee = ch.fk_id_employee
            %s
    );
`, dateFilter)

	s.logger.Infof("executing query: %s", query)
	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var employees []*entity.Employee
	for rows.Next() {
		employee := entity.Employee{}
		err := rows.Scan(&employee.ID, &employee.Surname, &employee.Name, &employee.Patronymic,
			&employee.Role, &employee.Salary, &employee.DateOfBirth, &employee.DateOfStart,
			&employee.Phone, &employee.City, &employee.Street, &employee.Zip, &employee.Password)
		if err != nil {
			s.logger.Errorf("error while scanning employee row: %s", err)
			return nil, err
		}
		employees = append(employees, &employee)
	}

	return employees, nil
}

func (s *statisticsStorage) GetEmployeesWithCheckSum(opts *service.GetEmployeesWithCheckSumOptions) ([]*entity.Employee, error) {
	query := fmt.Sprintf(`
	SELECT *
    	FROM employee e
    	WHERE e.id_employee IN (
    			SELECT DISTINCT fk_id_employee
    			FROM checks ch
    			WHERE NOT ch.sum_total < %f
    		)
    	AND NOT e.empl_role = 'Менеджер';
`, opts.Sum)

	s.logger.Infof("executing query: %s", query)
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var employees []*entity.Employee
	for rows.Next() {
		employee := entity.Employee{}
		err := rows.Scan(&employee.ID, &employee.Surname, &employee.Name, &employee.Patronymic,
			&employee.Role, &employee.Salary, &employee.DateOfBirth, &employee.DateOfStart,
			&employee.Phone, &employee.City, &employee.Street, &employee.Zip, &employee.Password)
		if err != nil {
			s.logger.Errorf("error while scanning employee row: %s", err)
			return nil, err
		}
		employees = append(employees, &employee)
	}

	return employees, nil
}
