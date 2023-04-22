import React, {useEffect, useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";
import Checkbox from "../UI/inputs/checkbox/Checkbox";

const ProductStoreFormPopup = ({setVisible, create, selectedRow, edit}) => {
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
            sale: false
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
            sale: false
        })
        setVisible(false)
    }
    const validateForm = () => {
        const idPattern = /^\d+$/; // дозволено тільки цифри
        const pricePattern = /^\d+(\.\d+)?$/; // дозволено тільки цифри та десяткові точки
        const countPattern = /^\d+(\.\d+)?$/; // дозволено тільки цифри та десяткові точки, включаючи від'ємні числа
        const errors = {};

        if(product.id.length!=12&&selectedRow!==undefined){
            errors.id='Довжина коду має бути 12 символів';
        }

        if(product.promotional_id!==''&&product.promotional_id!==null){
            if(product.promotional_id.length!=12){
                errors.promotional_id='Довжина коду акційного товару має бути 12 символів';
            }
        }
        if(product.promotional&&(product.promotional_id===''&&product.promotional_id===null)){
            errors.promotional='Якщо товар акційний повинно бути вказано UPC не акційного товару';
        }
        if (!idPattern.test(product.product_id) || !countPattern.test(product.count) || !pricePattern.test(product.price)) {
            errors.price='Будь ласка, введіть коректні числові значення для product_id, count та price.';
            return false;
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
                    <InputTextForm
                        name={"price"}
                        placeholder={"Ціна"}
                        value={product.price}
                        style={{marginBottom: '10px'}}
                        onChange={e => setProduct({
                            ...product,
                            price: e.target.value
                        })}>Ціна продажу</InputTextForm>
                    <Checkbox
                        name={"sale"}
                        id={"sale"}
                        checked = {product.promotional}
                        onChange={() => setProduct(prevState => ({...prevState, promotional: !prevState.promotional}))}
                        style={st}>Акційний товар</Checkbox>
                </div>
                <div className="form-content">
                    <InputTextForm
                        name={"ID"}
                        placeholder={"ID"}
                        value={ product.product_id}
                        onChange={e => setProduct({...product, product_id: e.target.value})}>ID товару</InputTextForm>
                    <InputTextForm
                        name={"count"}
                        placeholder={"Кількість"}
                        value={product.count}
                        onChange={e => setProduct({...product, count: e.target.value})}>Кількість</InputTextForm>
                    <InputTextForm
                        name={"promotional_id"}
                        placeholder={"ID"}
                        value={product.promotional_id===null ? '' : product.promotional_id}
                        onChange={e => setProduct({...product, promotional_id: e.target.value})}>UPC не акційного товару</InputTextForm>
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
