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
import axios from "axios";
const Products = () => {
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [products, setProducts] = useState( []);
    useEffect(() => {
        axios.get('http://localhost:8082/product/store')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const [product, setProduct] = useState({
        id:0,
        product_id:0,
        name:'',
        count:0,
        price:0,
        promotional: false,
        promotional_id: 0
    });
    const [selectedRow, setSelectedRow] = useState({
        id:0,
        product_id:0,
        name:'',
        count:0,
        price:0,
        promotional: false,
        promotional_id: 0
    });
    const tableData = ["UPC", "ID", 'Назва', "Кількість", "Ціна", "Акційний товар"];
    const [modal, setModal] = useState(false);
    const [isOpenSearch, setOpenSearch] = useState(false);
    const [onSale, setOnSale] = useState(false);
    const [notOnSale, setNotOnSale] = useState(false);
    const [filteredP, setFilteredP] = useState(products);

    function handleSearch(upc) {
        const product = products.find( e => e.id===upc)
        setProduct(product)
        setOpenSearch(true)
    }

    function handleSale(){
        setOnSale(!onSale)
    }
    function handleNotSale(){
        setNotOnSale(!notOnSale)
    }

    useEffect(() => {
        const filtered = products.filter(item => {
            if (onSale && item.promotional) {
                return true;
            }
            if (notOnSale && !item.promotional) {
                return true;
            }
            return  !onSale && !notOnSale;
        });

        setFilteredP(filtered);
    }, [products, onSale, notOnSale]);

    function handleAdd() {
        setSelectedRow(undefined);
        setModal(true);
    }
    function handleEdit() {
        if (selectedRow.id===''){
            alert('Виберіть товар для редагування')
        } else {
            setModal(true)
        }
    }
    function handleDelete() {
        if (selectedRow.id===''){
            alert('Виберіть товар для видалення')
        } else {
            setProducts(prevProducts => prevProducts.filter(product => product.id !== selectedRow.id));
        }
    }
    const createProduct = (newProduct) => {
        setProducts(prevProduct => [...prevProduct, newProduct]);
        setModal(false)
    }
    const editProduct = (newProduct, upc) => {
        newProduct.id=upc
        setProducts(products.map(e => {
            if (e.id===upc){
                return newProduct;
            }
            return e
        }));
        setModal(false)
    }
    function changeFieldsOrder(arr) {
        return arr.map(({ id, count, product_id, name, category_id, price,promotional, promotional_id}) => ({
            id,
            product_id,
            name,
            count,
            price,
            promotional
        }));
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
                         null
                    }
                <ModalForm visible={modal} setVisible={setModal}>
                    <ProductFormPopup setVisible={setModal} create={createProduct} edit={editProduct} selectedRow={selectedRow===undefined ? undefined : products.find(product => product.id === selectedRow.id)}/>
                </ModalForm>
            </div>
            <Table tableData={tableData} rowData={changeFieldsOrder(filteredP)} setSelectedRow={setSelectedRow}/>
        </div>
    );
};

export default Products;
