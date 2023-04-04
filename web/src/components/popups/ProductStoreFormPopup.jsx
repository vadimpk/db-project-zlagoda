import React, {useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";
import Radio from "../UI/inputs/radio/Radio";
import Checkbox from "../UI/inputs/checkbox/Checkbox";

const ProductStoreFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const st = {
        marginLeft: '-30px',
    }
    const [product, setProduct] = useState(selectedRow ||
        {
            id:  '',
            price: '',
            product_id: '',
            count: '',
            sale: false
        });

    const addNewProduct = (e) => {
        e.preventDefault()
        console.log(product)
        if (validateForm()) {
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
        const namePattern = /^[\p{L}0-9\s,.]+$/u; // дозволено букви українського алфавіту, цифри, кома та пробіл
        const countPattern = /^-?\d+(\.\d+)?$/; // дозволено тільки цифри та десяткові точки, включаючи від'ємні числа
        const errors = {};

        if (!idPattern.test(product.id) || !idPattern.test(product.product_id) || !countPattern.test(product.count) || !pricePattern.test(product.price)) {
            errors.id='Будь ласка, введіть коректні числові значення для id, product_id, count та price.';
            return false;
        }
        if (!namePattern.test(product.name)) {
            errors.name='Будь ласка, введіть коректні значення для поля name. Дозволено букви українського алфавіту, цифри, кома та пробіл.';
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
                        value={ selectedRow===undefined ? product.id : selectedRow.id}
                        onChange={e => setProduct({...product, id: e.target.value})}>id</InputTextForm>
                    <InputTextForm
                        name={"price"}
                        placeholder={"Ціна"}
                        value={product.price}
                        onChange={e => setProduct({
                            ...product,
                            price: e.target.value
                        })}>Ціна продажу</InputTextForm>
                </div>
                <div className="form-content">
                    <InputTextForm
                        name={"ID"}
                        placeholder={"ID"}
                        value={ selectedRow===undefined ? product.product_id : selectedRow.product_id}
                        onChange={e => setProduct({...product, product_id: e.target.value})}>product_id</InputTextForm>
                    <InputTextForm
                        name={"count"}
                        placeholder={"Кількість"}
                        value={product.count}
                        onChange={e => setProduct({...product, count: e.target.value})}>Кількість</InputTextForm>
                </div>
            </div>
            <Checkbox
                name={"sale"}
                id={"sale"}
                onClick={() => setProduct({...product, sale: selectedRow===undefined ? !product.sale : !selectedRow.sale})}
                style={st}>Акційний товар</Checkbox>

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
