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
    const authToken = localStorage.getItem('authToken');

    const {isManager, setIsManager} = useContext(ManagerContext);
    const [products, setProducts] = useState( []);
    const [selectPromotion, setSelectPromotion] = useState('');
    const [selectSort, setSelectSort] = useState('');

    const [product, setProduct] = useState({
        name:'',
        count:0,
        price:0,
        product_id:0,
        characteristics: ''
    });
    const [selectedRow, setSelectedRow] = useState({
        id:'',
        product_id:0,
        name:'',
        count:0,
        price:0,
        promotional: false,
        promotional_id:''
    });
    const tableData = ["UPC", "ID", 'Назва', "Кількість", "Ціна", "Акційний товар"];
    const [modal, setModal] = useState(false);
    const [isOpenSearch, setOpenSearch] = useState(false);

    function handleSearch(upc) {
        axios.get(`http://localhost:8082/product/store/${upc}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                const productId = response.data.product_id;
                Promise.all([getProductName(productId), getCharacteristics(productId)])
                    .then(responses => {
                        const [name, characteristics] = responses;
                        const updatedProduct = {
                            ...product,
                            product_id: productId,
                            count: response.data.count,
                            price: response.data.price,
                            name,
                            characteristics
                        };
                        setProduct(updatedProduct);
                        setOpenSearch(true);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                alert('Товар не знайдено')
                console.log(error);
            });
    }
    const getCharacteristics = (id) => {
        return axios.get(`http://localhost:8082/product/${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                return response.data.characteristics;
            })
            .catch(error => {
                console.log(error);
            });
    }
    const getProductName = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8082/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            return response.data.name;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
            const params = {
                sortAscending: true,
            };
        if (isManager) {
            params.sortCount = true;
        } else {
            params.sortName = true;
        }
            if (selectPromotion==='promotional') {
                params.promotion = true;
            }
            if (selectPromotion==='not-promotional') {
                params.promotion = false;
            }
        if (selectSort==='name-sort') {
            params.sortName = true;
        }
        if (selectSort==='count-sort') {
            params.sortCount = true;
        }
            axios.get('http://localhost:8082/product/store', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
                params
            })
                .then(response => {
                    const products = response.data;
                    const promises = products.map(product => getProductName(product.product_id));
                    Promise.all(promises).then(names => {
                        const productsWithNames = products.map((product, index) => {
                            return { ...product, name: names[index] };
                        });
                        setProducts(productsWithNames);
                    });
                })
                .catch(error => {
                    console.log(error);
                });
    }, [selectPromotion, selectSort]);

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
            axios.delete(`http://localhost:8082/product/store/${selectedRow.id}`,{
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    alert('Сервер відхилив ваш запит на видалення')
                    console.log(error);
                });
        }
    }

    const createProduct = (newProduct) => {
         axios.post('http://localhost:8082/product/store', newProduct, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                alert('Такий товар уже існує')
                console.log(error);
            });
        setModal(false)
    }
    const editProduct = (newProduct, upc) => {
        /*newProduct.id=upc
        setProductsInStore(productsInStore.map(e => {
            if (e.id===upc){
                return newProduct;
            }
            return e
        }));
        setModal(false)*/
    }
    function changeFieldsOrder(arr) {
        return arr.map(({ id, count, product_id, name, category_id, price,promotional, promotional_id}) => ({
            id,
            product_id,
            name,
            count,
            price,
            promotional1 : promotional? 'Так' : 'Ні'
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
                    <Select style={{ marginLeft: '15px' }} onChange={(e) => setSelectPromotion(e.target.value)}>
                        <option key={1} value={'promotional'}>
                            Акційний
                        </option>
                        <option key={2} value={'not-promotional'}>
                            Не акційний
                        </option>
                    </Select>
                    <Select style={{ marginLeft: '15px' }} onChange={(e) => setSelectSort(e.target.value)}>
                        <option key={1} value={'name-sort'}>
                            За алфавітом
                        </option>
                        <option key={2} value={'count-sort'}>
                            За кількістю
                        </option>
                    </Select>
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
            <Table tableData={tableData} rowData={changeFieldsOrder(products)} setSelectedRow={setSelectedRow}/>
        </div>
    );
};

export default Products;
