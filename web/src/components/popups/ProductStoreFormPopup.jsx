import React, {useEffect, useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";
import Checkbox from "../UI/inputs/checkbox/Checkbox";
import axios from "axios";
import DropSearch from "../UI/SearchBar/DropSearch";
import {updateProducts} from "../../functions";

const ProductStoreFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const authToken = localStorage.getItem('authToken');
    const productsUPC = JSON.parse(localStorage.getItem('products'));
    const [products, setProducts] = useState( []);
    const st = {
        marginLeft: '-30px',
    }
    const [product, setProduct] = useState(
        {
            id:  '',
            price: 0,
            product_id: 0,
            count: 0,
            promotional: false,
            promotional_id:''
        });
    useEffect(() => {
        if (selectedRow!==undefined) {
            setProduct(prevState => ({
                ...prevState,
                id: selectedRow.id,
                price: selectedRow.price,
                product_id: selectedRow.product_id,
                count: selectedRow.count,
                promotional: selectedRow.promotional,
                promotional_id: selectedRow.promotional_id
            }));
        }
    },[selectedRow]);
    useEffect(() => {
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
        updateProducts();
    },[]);

    const addNewProduct = (e) => {
        e.preventDefault()
        console.log(product)
        if (validateForm()) {
            const price = parseFloat(product.price)
            product.price = price
            const product_id = parseFloat(product.product_id)
            product.product_id = product_id
            const count = parseFloat(product.count)
            product.count = count
            if(product.promotional_id===''){
                product.promotional_id=null
            }
            console.log(product)
            create(product)
        }
        setProduct({
            id:  '',
            price: '',
            product_id: '',
            count: '',
            promotional: false
        });
        setVisible(false)
    }
    const editProduct = (e) => {
        e.preventDefault()
        setProduct({...product, id: selectedRow.id})
        console.log(product)
        if (validateForm()) {
            const price = parseFloat(product.price)
            product.price = price
            const product_id = parseFloat(product.product_id)
            product.product_id = product_id
            const count = parseFloat(product.count)
            product.count = count
            if(product.promotional_id===''){
                product.promotional_id=null
            }
            console.log(product)
            edit(product, selectedRow.id)
        }
        setProduct({
            id:  '',
            price: '',
            product_id: '',
            count: '',
            promotional: false
        })
        setVisible(false)
    }
    const validateForm = () => {
        const idPattern = /^\d+$/; // дозволено тільки цифри
        const pricePattern = /^\d+(\.\d+)?$/; // дозволено тільки цифри та десяткові точки
        const countPattern = /^\d+(\.\d+)?$/; // дозволено тільки цифри та десяткові точки, включаючи від'ємні числа
        const errors = {};

        if(product.id.length!=12&&selectedRow===undefined){
            errors.id='Довжина коду має бути 12 символів';
        }

        if(selectedRow!==undefined){
            if(selectedRow.promotional&&!product.promotional){
                errors.promotional='Акційний товар не може стати не акційним';
            }
        }

        if(product.promotional&&(product.promotional_id===''||product.promotional_id===null)){
            errors.promotional='Якщо товар акційний повинно бути вказано UPC не акційного товару';
        }
        if (!idPattern.test(product.product_id)) {
            errors.product_id='Будь ласка, введіть коректні числові значення для product_id';
            return false;
        }
        if (!countPattern.test(product.count)) {
            errors.count='Будь ласка, введіть коректні числові значення для count';
            return false;
        }
        if(!product.promotional) {
            if (!pricePattern.test(product.price)) {
                errors.price = 'Будь ласка, введіть коректні числові значення для price';
                return false;
            }
        }

        if (Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors).join('\n');
            alert(errorMessages);
            return false;
        }
        return true;
    }
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [wordEntered, setWordEntered] = useState(product.product_id);

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = products.filter((value) => {
            return value.name.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord === "") {
            setFilteredProducts([]);
        } else {
            setFilteredProducts(newFilter);
        }
    };
    const handleSelectedProduct = (id) => {
        setProduct({...product, product_id: id})
        setWordEntered(id);
        setFilteredProducts([]);
    };

    const [filteredProductsUPC, setFilteredProductsUPC] = useState([]);
    const [wordEnteredUPC, setWordEnteredUPC] = useState(product.promotional_id);

    const handleFilterUPC = (event) => {
        const searchWord = event.target.value;
        setWordEnteredUPC(searchWord);
        const newFilter = productsUPC.filter((value) => {
            return value.name.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord === "") {
            setFilteredProductsUPC([]);
        } else {
            setFilteredProductsUPC(newFilter);
        }
    };
    const handleSelectedProductUPC = (id) => {
        setProduct({...product, promotional_id: id})
        setWordEnteredUPC(id);
        setFilteredProductsUPC([]);
    };
    return (
        <form>
            <div className="form-top">
                {selectedRow===undefined
                    ?
                    <h3>Додати товар у магазині</h3>
                    :
                    <h3>Редагувати товар у магазині</h3>
                }

                <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
            </div>
            <div className="form-main">
                <div className="form-content">
                    <InputTextForm
                        name={"upc"}
                        placeholder={"UPC"}
                        value={ product.id }
                        onChange={e => setProduct({...product, id: e.target.value})}>UPC</InputTextForm>
                    <div style={{position: 'relative'}}>
                        <InputTextForm
                            name={"promotional_id"}
                            placeholder={"UPC"}
                            value={wordEnteredUPC}
                            onChange={handleFilterUPC}>UPC не акційного товару</InputTextForm>
                        {filteredProductsUPC.length !== 0 && (
                            <div className="dataResult">
                                {filteredProductsUPC.map((value, key) => {
                                    return (
                                        <p className="dataItem" key={key} onClick={() => handleSelectedProductUPC(value.upc)}>
                                            {value.name}
                                        </p>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <Checkbox
                        name={"promotional"}
                        id={"promotional"}
                        checked = {product.promotional}
                        onChange={() => setProduct(prevState => ({...prevState, promotional: !prevState.promotional}))}
                        style={st}>Акційний товар</Checkbox>
                </div>
                <div className="form-content">
                    <div style={{position: 'relative'}}>
                        <InputTextForm
                            name={"ID"}
                            placeholder={"ID"}
                            value={wordEntered}
                            onChange={handleFilter}>ID товару</InputTextForm>
                        {filteredProducts.length !== 0 && (
                            <div className="dataResult">
                                {filteredProducts.map((value, key) => {
                                    return (
                                        <p className="dataItem" key={key} onClick={() => handleSelectedProduct(value.id)}>
                                            {value.name}
                                        </p>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <InputTextForm
                        name={"count"}
                        placeholder={"Кількість"}
                        value={product.count}
                        onChange={e => setProduct({...product, count: e.target.value})}>Кількість</InputTextForm>
                    {
                        product.promotional
                            ?
                            null
                            :
                            <InputTextForm
                                name={"price"}
                                placeholder={"Ціна"}
                                value={product.price}
                                onChange={e => setProduct({
                                    ...product,
                                    price: e.target.value
                                })}>Ціна продажу</InputTextForm>
                    }
                </div>
            </div>

            {selectedRow===undefined
                ?
                <BigButton onClick={addNewProduct}>Додати</BigButton>
                :
                <BigButton onClick={editProduct}>Зберегти</BigButton>
            }
        </form>
    );
};

export default ProductStoreFormPopup;
