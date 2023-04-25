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
    const employee = JSON.parse(localStorage.getItem('employee'));
    const isManager = employee.role!=='Касир';
    const [categories, setCategories] = useState( []);
    const [selectedRowCategory, setSelectedRowCategory] = useState({
        id:0,
        name:''
    });
    const tableDataCategory = ["Номер", 'Назва'];
    const [select, setSelect] = useState("");
    const [products, setProducts] = useState( []);
    const [selectedRowProduct, setSelectedRowProduct] = useState({
        category_id:0,
        characteristics:'',
        id: 0,
        name:''
    });
    const [searchedProduct, setSearchedProduct] = useState({
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
        if (selectedRowCategory.id===0){
            alert('Виберіть категорію для редагування')
        } else {
            setModalCategory(true)
        }
    }
    function handleDeleteCategory() {
        if (selectedRowCategory.id===0){
            alert('Виберіть категорію для видалення')
        } else {
            axios.delete(`http://localhost:8082/product/category/${selectedRowCategory.id}`,{
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
    const createCategory = async (newCategory) => {
        axios.post('http://localhost:8082/product/category', newCategory, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                alert('Така категорія уже існує')
                console.log(error);
            });
        setModalCategory(false)
    }
    const editCategory = (newCategory, id) => {
        newCategory.id=id
        axios.put(`http://localhost:8082/product/category/${id}`, newCategory,{
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                alert('Така категорія уже існує')
                console.log(error);
            });
        setModalCategory(false)
    }
    function handleAddProduct() {
        setSelectedRowProduct(undefined);
        console.log('undefined set')
        setModalProduct(true);
    }
    function handleEditProduct() {
        if (selectedRowProduct.id===0){
            alert('Виберіть товар для редагування')
        } else {
            setModalProduct(true)
        }
    }
    function handleDeleteProduct() {
        if (selectedRowProduct.id===0){
            alert('Виберіть товар для видалення')
        } else {
            axios.delete(`http://localhost:8082/product/${selectedRowProduct.id}`,{
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
        axios.post('http://localhost:8082/product', newProduct, {
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
        setModalProduct(false);
    }

    const editProduct = (newProduct, ID) => {
        newProduct.id=ID
        axios.put(`http://localhost:8082/product/${ID}`, newProduct,{
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
    useEffect(() => {
        axios.get('http://localhost:8082/product/category', {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            params: {
                sortAscending: true,
                sortName: true
            }
        })
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        axios.get('http://localhost:8082/product', {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            params: {
                sortAscending: true,
                sortName: true
            }
        })
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    useEffect(() => {
        const id = categories.find(cat => cat.name === select)?.id;
            axios.get('http://localhost:8082/product', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
                params: {
                    sortAscending: true,
                    sortName: true,
                    categoryID: id
                }
            })
                .then(response => {
                    setProducts(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
    }, [select]);
    useEffect(() => {
        if (searchedProduct !== undefined) {
            axios
                .get('http://localhost:8082/product', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    params: {
                        search: searchedProduct.name
                    }
                })
                .then(response => {
                    setProducts(response.data);
                }).catch(error => {
                    console.log(error);
                    alert("Товарів з такою назвою немає");
            })
        }
    }, [searchedProduct])
    function handleSearch(name) {
        setSearchedProduct(prevState => {
            return {
                ...prevState,
                name: name
            };
        });
    }
    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                    {
                    isManager
                    ?
                    <>
                    <PrintButton/>
                    <RoundButton onClick={handleEditCategory}><img src={edit} width="14px" height="12px"/></RoundButton>
                    <RoundButton onClick={handleDeleteCategory}>&minus;</RoundButton>
                    <RoundButton onClick={handleAddCategory}>+</RoundButton>
                    </>
                    :
                        <Searchbar onSearch={handleSearch} placeholder={"Введіть назву товару"}/>
                    }
                </div>
                <ModalForm visible={modalCategory} setVisible={setModalCategory}>
                    <CategoryFormPopup setVisible={setModalCategory} create={createCategory} edit={editCategory} selectedRow={selectedRowCategory===undefined ? undefined : categories.find(category => category.id === selectedRowCategory.id)}/>
                </ModalForm>
                <div className="filter-left">
                    <Select onChange={(e) => setSelect(e.target.value)}>
                        {
                            categories.map((item, index) => (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))
                        }
                    </Select>
                    {
                        isManager
                        ?
                            <>
                            <RoundButton onClick={handleAddProduct}>+</RoundButton>
                            <RoundButton onClick={handleDeleteProduct}>&minus;</RoundButton>
                            <RoundButton onClick={handleEditProduct}><img src={edit} width="14px" height="12px"/></RoundButton>
                            <PrintButton/>
                            </>
                        :
                        null
                    }
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
                {
                    isManager
                        ?
                        <Table tableData={tableDataCategory} rowData={categories}
                               setSelectedRow={setSelectedRowCategory}/>
                        :
                        null
                }
                <Table tableData={tableDataProduct} rowData={transformProducts(products)} setSelectedRow={setSelectedRowProduct}/>
            </div>
        </div>
    );
};

export default Category;
