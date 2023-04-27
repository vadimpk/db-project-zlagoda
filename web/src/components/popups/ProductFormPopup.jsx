import React, {useEffect, useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";
import axios from "axios";

const ProductFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const authToken = localStorage.getItem('authToken');
    const [categories, setCategories] = useState( []);
    const [product, setProduct] = useState(
        {
            id:0,
            name:'',
            category_id: 0,
            characteristics:''
        });

    useEffect(() => {
        if (selectedRow!==undefined) {
            setProduct(selectedRow)
        }else {
            setProduct({
                id:0,
                name:'',
                category_id: 0,
                characteristics:''
            })
        }
    },[selectedRow]);
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
    },[]);

    const addNewProduct = (e) => {
        e.preventDefault()
        if (validateForm()) {
            const id = parseFloat(product.id)
            product.id=id
            const category_id = parseFloat(product.category_id)
            product.category_id=category_id
            create(product)
        }
        setProduct({
            id:0,
            name:'',
            category_id: 0,
            characteristics:''
        });
        setVisible(false)
    }
    const editProduct = (e) => {
        e.preventDefault()
        setProduct({...product, id: selectedRow.id})
        if (validateForm()) {
            const id = parseFloat(product.id)
            product.id=id
            const category_id = parseFloat(product.category_id)
            product.category_id=category_id
            edit(product, selectedRow.id)
        }
        setProduct({
            id:0,
            name:'',
            category_id: 0,
            characteristics:''
        })
        setVisible(false)
    }

    const [filteredCategories, setFilteredCategories] = useState([]);
    const [wordEntered, setWordEntered] = useState(product.category_id);

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = categories.filter((value) => {
            return value.name.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord === "") {
            setFilteredCategories([]);
        } else {
            setFilteredCategories(newFilter);
        }
    };
    const handleSelectedCategory = (id) => {
        setProduct({...product, category_id: id})
        setWordEntered(id);
        setFilteredCategories([]);
    };

    const validateForm = () => {
        const errors = {};

        if (!/^\d+$/.test(product.id)) {
            errors.id = "ID повинен складатися тільки з цифр";
        }
        if (!/^\d+$/.test(product.category_id)) {
            errors.category_id = "ID категорії повинен складатися тільки з цифр";
        }
        if (product.name.length > 50) {
            errors.name = "Назва повинна бути не більше 50 символів";
        }
        if (product.characteristics.length > 100) {
            errors.characteristics = "Характеристика повинна бути не більше 100 символів";
        }
        if (Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors).join('\n');
            alert(errorMessages);
            return false;
        }
        return true;
    }
    return (
        <form>
            <div className="form-top">
                {selectedRow===undefined
                    ?
                    <h3>Додати товар</h3>
                    :
                    <h3>Редагувати товар</h3>
                }

                <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
            </div>
            <div className="form-main">
                <div className="form-content">
                    <InputTextForm
                        name={"ID"}
                        placeholder={"ID"}
                        value={product.id}
                        onChange={e => setProduct({...product, id: e.target.value})}>ID</InputTextForm>
                    <InputTextForm
                        name={"name"}
                        placeholder={"Назва"}
                        value={product.name}
                        onChange={e => setProduct({
                            ...product,
                            name: e.target.value
                        })}>Назва</InputTextForm>
                </div>
                <div className="form-content">
                    <div style={{position: 'relative'}}>
                    <InputTextForm
                        name={"ID"}
                        placeholder={"ID"}
                        value={wordEntered}
                        onChange={handleFilter}>ID категорії</InputTextForm>
                    {filteredCategories.length != 0 && (
                        <div className="dataResult">
                            {filteredCategories.map((value, key) => {
                                return (
                                    <p className="dataItem" key={key} onClick={() => handleSelectedCategory(value.id)}>
                                        {value.name}
                                    </p>
                                );
                            })}
                        </div>
                    )}
                    </div>

                    <InputTextForm
                        name={"characteristics"}
                        placeholder={"Характеристика"}
                        value={product.characteristics}
                        onChange={e => setProduct({
                            ...product,
                            characteristics: e.target.value
                        })}>Характеристика</InputTextForm>
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

export default ProductFormPopup;
