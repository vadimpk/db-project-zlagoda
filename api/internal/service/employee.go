package service

import (
	"fmt"
	"github.com/apsdehal/go-logger"
	"github.com/golang-jwt/jwt"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
	"github.com/vadimpk/db-project-zlagoda/api/pkg/token"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type employeeService struct {
	logger   *logger.Logger
	config   *config.Config
	storages Storages
}

func NewEmployeeService(opts Options) EmployeeService {
	return &employeeService{
		logger:   opts.Logger,
		storages: opts.Storages,
		config:   opts.Config,
	}
}

var _ EmployeeService = (*employeeService)(nil)

func (s *employeeService) Create(employee *entity.Employee) (*entity.Employee, error) {
	existingEmployee, err := s.storages.Employee.Get(employee.ID)
	if err != nil {
		s.logger.Errorf("failed to get employee: %v", err)
		return nil, fmt.Errorf("failed to get employee: %w", err)
	}
	if existingEmployee != nil {
		s.logger.Infof("employee already exists")
		return nil, ErrCreateEmployeeAlreadyExists
	}

	employee.Password, err = HashPassword(employee.Password)
	if err != nil {
		s.logger.Errorf("failed to hash password: %v", err)
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	s.logger.Infof("creating employee: %#v", employee)
	return s.storages.Employee.Create(employee)
}

func (s *employeeService) Get(id string) (*entity.Employee, error) {
	s.logger.Infof("getting employee: %#v", id)
	return s.storages.Employee.Get(id)
}

func (s *employeeService) List(opts ListEmployeeOptions) ([]*entity.Employee, error) {
	s.logger.Infof("listing employees: %#v", opts)
	return s.storages.Employee.List(opts)
}

func (s *employeeService) Update(id string, employee *entity.Employee) (*entity.Employee, error) {
	s.logger.Infof("updating employee: %#v", employee)
	previousEmployee, err := s.storages.Employee.Get(id)
	if err != nil {
		s.logger.Errorf("error getting employee: %#v", err)
		return nil, err
	}
	if previousEmployee == nil {
		s.logger.Errorf("employee not found")
		return nil, ErrEmployeeNotFound
	}

	employeeWithID, err := s.storages.Employee.Get(employee.ID)
	if err != nil {
		s.logger.Errorf("error getting employee: %#v", err)
		return nil, err
	}
	if employeeWithID != nil && employeeWithID.ID != id {
		s.logger.Errorf("employee with this id already exists")
		return nil, ErrEmployeeWithIDAlreadyExists
	}

	if employee.Password != "" {
		employee.Password, err = HashPassword(employee.Password)
		if err != nil {
			s.logger.Errorf("failed to hash password: %v", err)
			return nil, fmt.Errorf("failed to hash password: %w", err)
		}
	} else {
		employee.Password = previousEmployee.Password
	}

	return s.storages.Employee.Update(id, employee)
}

func (s *employeeService) Delete(id string) error {
	s.logger.Infof("deleting employee: %#v", id)
	employee, err := s.storages.Employee.Get(id)
	if err != nil {
		s.logger.Errorf("failed to get employee: %v", err)
		return fmt.Errorf("failed to get employee: %w", err)
	}
	if employee == nil {
		s.logger.Infof("employee not found")
		return ErrEmployeeNotFound
	}

	checks, err := s.storages.Check.ListChecks(&ListChecksOptions{
		CardID: &id,
	})
	if err != nil {
		s.logger.Errorf("failed to get checks: %v", err)
		return err
	}
	if len(checks) > 0 {
		s.logger.Infof("card has checks")
		return ErrDeleteCardChecksExist
	}
	return s.storages.Employee.Delete(id)
}

func (s *employeeService) Login(id string, password string) (*entity.Employee, string, error) {
	s.logger.Infof("login employee: %#v", id)

	employee, err := s.storages.Employee.Get(id)
	if err != nil {
		s.logger.Errorf("failed to get employee: %v", err)
		return nil, "", fmt.Errorf("failed to get employee: %w", err)
	}
	if employee == nil {
		s.logger.Infof("employee not found")
		return nil, "", ErrLoginEmployeeNotFound
	}

	isValidPassword := CheckPassword(password, employee.Password)
	if !isValidPassword {
		s.logger.Infof("invalid password")
		return nil, "", ErrLoginEmployeeInvalidPassword
	}

	tokenString, err := token.SignToken(&token.TokenClaims{
		UserID:   employee.ID,
		UserRole: employee.Role,
		StandardClaims: jwt.StandardClaims{
			NotBefore: time.Now().Unix(),
			ExpiresAt: time.Now().Add(time.Hour * 24 * 14).Unix(),
			Issuer:    "gd-api",
		},
	}, "u6i4t3bhjkfewuaio83uhmdio423")
	if err != nil {
		s.logger.Errorf("failed to sign auth token: %v", err)
		return nil, "", fmt.Errorf("failed to sign auth token: %w", err)
	}

	return employee, tokenString, nil
}

func (s *employeeService) VerifyAccessToken(authToken string) (*entity.Employee, error) {
	claims, err := token.VerifyToken(authToken, "u6i4t3bhjkfewuaio83uhmdio423")
	if err != nil {
		s.logger.Infof("invalid access token", "err", err)
		return nil, ErrVerifyAccessTokenInvalidAccessToken
	}

	user, err := s.storages.Employee.Get(claims.UserID)
	if err != nil {
		s.logger.Errorf("failed to get user", "err", err)
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	if user == nil {
		s.logger.Infof("user not found")
		return nil, ErrVerifyAccessTokenEmployeeNotFound
	}

	s.logger.Infof("succesfully verified access token")
	return user, nil
}

// HashPassword takes a plaintext password and returns its hashed value
func HashPassword(password string) (string, error) {
	hashedPasswordBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	hashedPassword := string(hashedPasswordBytes)
	return hashedPassword, nil
}

// CheckPassword takes a plaintext password and a hashed password, and returns whether they match
func CheckPassword(password, hashedPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
