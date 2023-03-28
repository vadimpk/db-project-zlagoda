import React, {useContext, useEffect, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from "../assets/images/edit.svg";
import PrintButton from "../components/UI/buttons/PrintButton";
import {ManagerContext} from "../context";
import Select from "../components/UI/select/Select";
import EmployeePopup from "../components/popups/EmployeePopup";
import Modal from "../components/UI/Modal/Modal";
import ProductPopup from "../components/popups/ProductPopup";
import Table from "../components/UI/table/Table";
import CustomerFormPopup from "../components/popups/CustomerFormPopup";
import ModalForm from "../components/UI/Modal/ModalForm";
import ProductFormPopup from "../components/popups/ProductStoreFormPopup";

const Products = () => {
    const {isManager, setIsManager} = useContext(ManagerContext);
    //EXAMPLE
    const [products, setProducts] = useState( [
        {
            UPC:'1234567890',
            ID:'1234567890',
            name:'Хліб Київхліб Супер тост світлий нарізаний 350г',
            amount:'126',
            price:'23,6',
            category:'Хлібобулочні вироби',
            manufacturer:'ТД "Золотий Урожай"',
            characteristics:'Тостовий різаний хліб ідеально підходить для смаження на сковороді та приготування тостів.',
            sale: true
        },
        {
            UPC:'1234567891',
            ID:'1234567890',
            name:'Рис',
            amount:'56',
            price:'59,8',
            category:'Бакалія',
            manufacturer:'Єгипет',
            characteristics:'дуже смачний рис, напевно',
            sale:false
        },
        {
            UPC:'1234567896',
            ID:'1234567890',
            name:'Шоколад',
            amount:'23',
            price:'42',
            category:'Солодощі',
            manufacturer:'Рошен',
            characteristics:'порошенко вподобав допис',
            sale: true
        }
    ]);
    //example
    const categories = ['Категорія','Бакалія','Солодощі','Хлібобулочні вироби','Напої','Молочні продукти'];
    const [product, setProduct] = useState({
        UPC:'',
        ID:'',
        name:'',
        amount:'',
        price:'',
        category:'',
        manufacturer:'',
        characteristics:'',
        sale: false
    });
    const [selectedRow, setSelectedRow] = useState({
        UPC:'',
        ID:'',
        name:'',
        amount:'',
        price:'',
        category:'',
        manufacturer:'',
        characteristics:'',
        sale: false
    });
    const tableData = ["UPC", "ID", 'Назва', "Кількість", "Ціна", "Категорія", "Виробник", "Характеристика"];
    const [modal, setModal] = useState(false);
    const [isOpenSearch, setOpenSearch] = useState(false);
    const [onSale, setOnSale] = useState(false);
    const [notOnSale, setNotOnSale] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [filteredP, setFilteredP] = useState(products);

    function handleSearch(upc) {
        const product = products.find( e => e.UPC===upc)
        setProduct(product)
        setOpenSearch(true)
    }

    function handleSale(){
        setOnSale(!onSale)
    }
    function handleNotSale(){
        setNotOnSale(!notOnSale)
    }
    function handleSelect (category) {
        setSelectedOption(category);
    }
    useEffect(() => {
        const filtered = products.filter(item => {
            if (selectedOption && selectedOption !== 'Категорія') {
                return item.category === selectedOption;
            }
            if (onSale && item.sale) {
                return true;
            }
            if (notOnSale && !item.sale) {
                return true;
            }
            return !selectedOption && !onSale && !notOnSale;
        });

        setFilteredP(filtered);
    }, [products, selectedOption, onSale, notOnSale]);

    function handleAdd() {
        setSelectedRow(undefined);
        setModal(true);
    }
    function handleEdit() {
        if (selectedRow.UPC===''){
            alert('Виберіть товар для редагування')
        } else {
            setModal(true)
        }
    }
    function handleDelete() {
        if (selectedRow.UPC===''){
            alert('Виберіть товар для видалення')
        } else {
            setProducts(prevProducts => prevProducts.filter(product => product.UPC !== selectedRow.UPC));
        }
    }
    const createProduct = (newProduct) => {
        setProducts(prevProduct => [...prevProduct, newProduct]);
        setModal(false)
    }
    const editProduct = (newProduct, upc) => {
        newProduct.UPC=upc
        setProducts(products.map(e => {
            if (e.UPC===upc){
                return newProduct;
            }
            return e
        }));
        setModal(false)
    }
    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                    <Searchbar onSearch={handleSearch} placeholder={"Введіть UPC товару"}/>
                    <Modal visible={isOpenSearch} setVisible={setOpenSearch}>
                        <ProductPopup product={product} setVisible={setOpenSearch}/>
                    </Modal>
                    <Checkbox
                        name={"sale"}
                        checked={onSale}
                        onChange={handleSale}>Акційні товари</Checkbox>
                    <Checkbox
                        name={"nosale"}
                        checked={notOnSale}
                        onChange={handleNotSale}>Не акційні товари</Checkbox>
                </div>
                    {
                     isManager
                     ?
                         <div className="filter-left">
                         <RoundButton onClick={handleAdd}>+</RoundButton>
                        <RoundButton onClick={handleDelete}>&minus;</RoundButton>
                        <RoundButton onClick={handleEdit}><img src={edit} width="14px" height="12px"/></RoundButton>
                        <PrintButton/>
                         </div>
                     :
                         <div className="filter-left">
                        <Select value={selectedOption} onChange={(e) => handleSelect(e.target.value)}>
                            {
                                categories.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))
                            }
                        </Select>
                         </div>
                    }
                <ModalForm visible={modal} setVisible={setModal}>
                    <ProductFormPopup setVisible={setModal} create={createProduct} edit={editProduct} selectedRow={selectedRow===undefined ? undefined : products.find(product => product.UPC === selectedRow.UPC)}/>
                </ModalForm>
            </div>
            <Table tableData={tableData} rowData={filteredP} setSelectedRow={setSelectedRow}/>
        </div>
    );
};

export default Products;
