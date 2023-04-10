import React, {useEffect, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from "../assets/images/edit.svg";
import PrintButton from "../components/UI/buttons/PrintButton";
import Select from "../components/UI/select/Select";
import Table from "../components/UI/table/Table";
import CustomerFormPopup from "../components/popups/CustomerFormPopup";
import ModalForm from "../components/UI/Modal/ModalForm";
import CategoryFormPopup from "../components/popups/CategoryFormPopup";
import ProductFormPopup from "../components/popups/ProductFormPopup";
import axios from "axios";

const Category = () => {
    const authToken = localStorage.getItem('authToken');
    const [categories, setCategories] = useState( []);
    useEffect(() => {
        axios.get('http://localhost:8082/product/category', {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            params: {
                sortAscending: true,
                sortSurname: true
            }
        })
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.log(error);
            });

    }, []);
    /*
        useEffect(() => {
        axios.get('http://localhost:8082/customer-card', {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            params: {
                sortAscending: true,
                sortSurname: true
            }
        })
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
     */
    const [selectedRowCategory, setSelectedRowCategory] = useState({
        id:0,
        name:''
    });
    const tableDataCategory = ["Номер", 'Назва'];
    const [select, setSelect] = useState("Категорія")
    const [products, setProducts] = useState( []);
    useEffect(() => {
        axios.get('http://localhost:8082/product/category')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const filteredProducts = select!=="Категорія" ? products.filter(product => product.category_id===select) : products
    const [selectedRowProduct, setSelectedRowProduct] = useState({
        category_id:0,
        characteristics:'',
        id: 0,
        name:''
    });
    const tableDataProduct = ["ID", 'Назва',"Категорія", "Характеристика"];
    const [modalCategory, setModalCategory] = useState(false);
    const [modalProduct, setModalProduct] = useState(false);

    function handleAddCategory() {
        setSelectedRowCategory(undefined);
        setModalCategory(true);
    }
    function handleEditCategory() {
        if (selectedRowCategory.id===''){
            alert('Виберіть категорію для редагування')
        } else {
            setModalCategory(true)
        }
    }
    function handleDeleteCategory() {
        if (selectedRowCategory.id===''){
            alert('Виберіть категорію для видалення')
        } else {
            setCategories(prevCustomers => prevCustomers.filter(category => category.id !== selectedRowCategory.id));
        }
    }
    const createCategory = async (newCategory) => {
        try {
            const response = await axios.post('http://localhost:8082/product/category', newCategory);
            return response.data;
        } catch (error) {
            console.error(error);
        }
        //setCategories(prevCategories => [...prevCategories, newCategory]);
        setModalCategory(false)
    }
    //////////
    const editCategory = (newCategory, id) => {
        newCategory.id=id
        setCategories(categories.map(e => {
            if (e.id===id){
                return newCategory;
            }
            return e
        }));
        setModalCategory(false)
    }
    function handleAddProduct() {
        setSelectedRowProduct(undefined);
        setModalProduct(true);
    }
    function handleEditProduct() {
        if (selectedRowProduct.id===''){
            alert('Виберіть категорію для редагування')
        } else {
            setModalProduct(true)
        }
    }
    function handleDeleteProduct() {
        if (selectedRowProduct.id===''){
            alert('Виберіть категорію для видалення')
        } else {
            setProducts(prevProducts => prevProducts.filter(product => product.id !== selectedRowProduct.id));
        }
    }
    /////////////////
    const createProduct = (newProduct) => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
        setModalProduct(false);
    }
    /////////////////
    const editProduct = (newProduct, ID) => {
        newProduct.id=ID
        setProducts(products.map(e => {
            if (e.id===ID){
                return newProduct;
            }
            return e
        }));
        setModalProduct(false)
    }
    function transformProducts(products) {
        const transformedProducts = products.map(({ category_id, ...product }) => ({
            ...product,
            category_name: categories.find(({ id }) => id === category_id)?.name || ''
        }));

        return changeFieldsOrder(transformedProducts);
    }

    function changeFieldsOrder(arr) {
        return arr.map(({ category_name, characteristics, id, name, category_id }) => ({
            id,
            name,
            category_name,
            characteristics
        }));
    }

    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                    <PrintButton/>
                    <RoundButton onClick={handleEditCategory}><img src={edit} width="14px" height="12px"/></RoundButton>
                    <RoundButton onClick={handleDeleteCategory}>&minus;</RoundButton>
                    <RoundButton onClick={handleAddCategory}>+</RoundButton>
                </div>
                <ModalForm visible={modalCategory} setVisible={setModalCategory}>
                    <CategoryFormPopup setVisible={setModalCategory} create={createCategory} edit={editCategory} selectedRow={selectedRowCategory===undefined ? undefined : categories.find(category => category.id === selectedRowCategory.id)}/>
                </ModalForm>
                <div className="filter-left">
                    <Select onChange={(e) => setSelect(e.target.value)}>
                        <option key={-1} value={"Категорія"}>Категорія</option>
                        {
                            categories.map((item, index) => (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))
                        }
                    </Select>
                    <RoundButton onClick={handleAddProduct}>+</RoundButton>
                    <RoundButton onClick={handleDeleteProduct}>&minus;</RoundButton>
                    <RoundButton onClick={handleEditProduct}><img src={edit} width="14px" height="12px"/></RoundButton>
                    <PrintButton/>
                </div>
                <ModalForm visible={modalProduct} setVisible={setModalProduct}>
                    <ProductFormPopup
                        setVisible={setModalProduct}
                        create={createProduct}
                        edit={editProduct}
                        selectedRow={selectedRowProduct===undefined ? undefined : products.find(product => product.id === selectedRowProduct.id)}/>
                </ModalForm>
            </div>
            <div className="two-tables-div">
                <Table tableData={tableDataCategory} rowData={categories} setSelectedRow={setSelectedRowCategory}/>
                <Table tableData={tableDataProduct} rowData={transformProducts(filteredProducts)} setSelectedRow={setSelectedRowProduct}/>
            </div>
        </div>
    );
};

export default Category;
