package service

import (
	"github.com/apsdehal/go-logger"
	"github.com/thanhpk/randstr"
	"github.com/vadimpk/db-project-zlagoda/api/config"
	"github.com/vadimpk/db-project-zlagoda/api/internal/entity"
)

type checkService struct {
	logger   *logger.Logger
	config   *config.Config
	storages Storages
}

func NewCheckService(opts Options) CheckService {
	return &checkService{
		logger:   opts.Logger,
		config:   opts.Config,
		storages: opts.Storages,
	}
}

var _ CheckService = (*checkService)(nil)

func (s *checkService) CreateCheck(check *entity.Check) (*entity.Check, error) {
	s.logger.Infof("creating check: %#v", check)
	check.ID = randstr.String(10)
	return s.storages.Check.CreateCheck(check)
}

func (s *checkService) GetCheck(id string) (*entity.Check, error) {
	s.logger.Infof("getting check: %#v", id)
	return s.storages.Check.GetCheck(id)
}

func (s *checkService) ListChecks(opts *ListChecksOptions) ([]*entity.Check, error) {
	s.logger.Infof("listing checks with options: %#v", opts)
	return s.storages.Check.ListChecks(opts)
}

//func (s *checkService) UpdateCheck(id string, check *entity.Check) (*entity.Check, error) {
//	s.logger.Infof("updating check: %#v", check)
//	check.ID = id
//	return s.storages.Check.UpdateCheck(id, check)
//}

func (s *checkService) DeleteCheck(id string) error {
	s.logger.Infof("deleting check: %#v", id)
	check, err := s.storages.Check.GetCheck(id)
	if err != nil {
		s.logger.Errorf("error getting check: %#v", err)
		return err
	}
	if check == nil {
		s.logger.Infof("check with id %s not found", id)
		return ErrDeleteCheckNotFound
	}

	return s.storages.Check.DeleteCheck(id)
}

func (s *checkService) CreateCheckItem(checkItem *entity.CheckItem) (CreateOrUpdateCheckItemOutput, error) {
	s.logger.Infof("creating check item: %#v", checkItem)

	// Check if product exists and if there are enough products in store
	// If there are enough products, then update store product count
	product, err := s.storages.Product.GetStoreProduct(checkItem.ID.StoreProductID)
	if err != nil {
		s.logger.Errorf("error getting store product: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}
	if product == nil {
		s.logger.Infof("store product with id %s not found", checkItem.ID.StoreProductID)
		return CreateOrUpdateCheckItemOutput{}, ErrCreateCheckItemProductNotFound
	}

	if product.Count < checkItem.ProductCount {
		s.logger.Infof("not enough products in store")
		return CreateOrUpdateCheckItemOutput{}, ErrCreateCheckItemNotEnoughProducts
	}

	product.Count -= checkItem.ProductCount

	product, err = s.storages.Product.UpdateStoreProduct(checkItem.ID.StoreProductID, product)
	if err != nil {
		s.logger.Errorf("error updating store product: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}
	s.logger.Infof("store product updated: %#v", product)

	// Create check item
	checkItem, err = s.storages.Check.CreateCheckItem(checkItem)
	if err != nil {
		s.logger.Errorf("error creating check item: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}

	// Update check total price and VAT
	check, err := s.storages.Check.GetCheck(checkItem.ID.CheckID)
	if err != nil {
		s.logger.Errorf("error getting check: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}

	check.TotalPrice += checkItem.ProductPrice * float64(checkItem.ProductCount)
	check.VAT = check.TotalPrice * 0.2

	_, err = s.storages.Check.UpdateCheck(check.ID, check)
	if err != nil {
		s.logger.Errorf("error updating check: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}
	s.logger.Infof("check updated: %#v", check)

	s.logger.Infof("check item created: %#v", checkItem)
	return CreateOrUpdateCheckItemOutput{
		CheckItem: checkItem,
		Check:     check,
		Product:   product,
	}, nil
}

func (s *checkService) GetCheckItem(id entity.CheckItemID) (*entity.CheckItem, error) {
	s.logger.Infof("getting check item: %#v", id)
	return s.storages.Check.GetCheckItem(id)
}

func (s *checkService) ListCheckItems(opts *ListCheckItemsOptions) ([]*entity.CheckItem, error) {
	s.logger.Infof("listing check items with options: %#v", opts)
	return s.storages.Check.ListCheckItems(opts)
}

func (s *checkService) UpdateCheckItem(id entity.CheckItemID, checkItem *entity.CheckItem) (CreateOrUpdateCheckItemOutput, error) {
	s.logger.Infof("updating check item: %#v with id: %#v", checkItem, id)

	// Get previous check item
	previousCheckItem, err := s.storages.Check.GetCheckItem(id)
	if err != nil {
		s.logger.Errorf("error getting check item: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}
	s.logger.Infof("previous check item: %#v", previousCheckItem)

	// Check if product exists and if there are enough products in store
	// and update store product count
	product, err := s.storages.Product.GetStoreProduct(id.StoreProductID)
	if err != nil {
		s.logger.Errorf("error getting store product: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}
	s.logger.Infof("store product: %#v", product)

	if checkItem.ProductCount > previousCheckItem.ProductCount {
		if product.Count < checkItem.ProductCount-previousCheckItem.ProductCount {
			s.logger.Infof("not enough products in store")
			return CreateOrUpdateCheckItemOutput{}, ErrUpdateCheckItemNotEnoughProducts
		}
		product.Count -= checkItem.ProductCount - previousCheckItem.ProductCount
	}
	if checkItem.ProductCount <= previousCheckItem.ProductCount {
		product.Count += previousCheckItem.ProductCount - checkItem.ProductCount
	}

	product, err = s.storages.Product.UpdateStoreProduct(product.ID, product)
	if err != nil {
		s.logger.Errorf("error updating store product: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}
	s.logger.Infof("store product updated: %#v", product)

	// Update check item
	updatedCheckItem, err := s.storages.Check.UpdateCheckItem(id, checkItem)
	if err != nil {
		s.logger.Errorf("error updating check item: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}

	// Update check total price and VAT
	check, err := s.storages.Check.GetCheck(id.CheckID)
	if err != nil {
		s.logger.Errorf("error getting check: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}

	check.TotalPrice -= previousCheckItem.ProductPrice * float64(previousCheckItem.ProductCount)
	check.TotalPrice += updatedCheckItem.ProductPrice * float64(updatedCheckItem.ProductCount)
	check.VAT = check.TotalPrice * 0.2

	_, err = s.storages.Check.UpdateCheck(check.ID, check)
	if err != nil {
		s.logger.Errorf("error updating check: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}
	s.logger.Infof("check updated: %#v", check)

	s.logger.Infof("check item updated: %#v", updatedCheckItem)
	return CreateOrUpdateCheckItemOutput{
		CheckItem: updatedCheckItem,
		Check:     check,
		Product:   product,
	}, nil
}

func (s *checkService) DeleteCheckItem(id entity.CheckItemID) (CreateOrUpdateCheckItemOutput, error) {
	s.logger.Infof("deleting check item: %#v", id)

	// Get check item
	checkItem, err := s.storages.Check.GetCheckItem(id)
	if err != nil {
		s.logger.Errorf("error getting check item: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}
	if checkItem == nil {
		s.logger.Infof("check item with id %s not found", id)
		return CreateOrUpdateCheckItemOutput{}, ErrDeleteCheckItemNotFound
	}

	// Update store product count
	product, err := s.storages.Product.GetStoreProduct(checkItem.ID.StoreProductID)
	if err != nil {
		s.logger.Errorf("error getting store product: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}

	product.Count += checkItem.ProductCount

	product, err = s.storages.Product.UpdateStoreProduct(checkItem.ID.StoreProductID, product)
	if err != nil {
		s.logger.Errorf("error updating store product: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}
	s.logger.Infof("store product updated: %#v", product)

	// Delete check item
	err = s.storages.Check.DeleteCheckItem(id)
	if err != nil {
		s.logger.Errorf("error deleting check item: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}

	// Update check total price and VAT
	check, err := s.storages.Check.GetCheck(id.CheckID)
	if err != nil {
		s.logger.Errorf("error getting check: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}

	check.TotalPrice -= checkItem.ProductPrice * float64(checkItem.ProductCount)
	check.VAT = check.TotalPrice * 0.2

	_, err = s.storages.Check.UpdateCheck(check.ID, check)
	if err != nil {
		s.logger.Errorf("error updating check: %#v", err)
		return CreateOrUpdateCheckItemOutput{}, err
	}
	s.logger.Infof("check updated: %#v", check)

	s.logger.Infof("check item deleted: %#v", id)
	return CreateOrUpdateCheckItemOutput{
		CheckItem: checkItem,
		Check:     check,
		Product:   product,
	}, nil
}
