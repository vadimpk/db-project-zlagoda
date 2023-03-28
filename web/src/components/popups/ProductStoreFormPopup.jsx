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
            UPC:  '',
            price: '',
            ID: '',
            amount: '',
            sale: false
        });

    const addNewProduct = (e) => {
        e.preventDefault()
        console.log(product)
        if (validateForm()) {
            create(product)
        }
        setProduct({
            UPC:  '',
            price: '',
            ID: '',
            amount: '',
            sale: false
        });
        setVisible(false)
    }
    const editProduct = (e) => {
        e.preventDefault()
        setProduct({...product, UPC: selectedRow.UPC})
        console.log(product)
        if (validateForm()) {
            edit(product, selectedRow.UPC)
        }
        setProduct({
            UPC:  '',
            price: '',
            ID: '',
            amount: '',
            sale: false
        })
        setVisible(false)
    }
    const validateForm = () => {
        const nameRegex = /^[іїа-яА-Я]+$/;
        const errors = {};

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
                        value={ selectedRow===undefined ? product.UPC : selectedRow.UPC}
                        onChange={e => setProduct({...product, UPC: e.target.value})}>UPC</InputTextForm>
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
                        value={ selectedRow===undefined ? product.ID : selectedRow.ID}
                        onChange={e => setProduct({...product, ID: e.target.value})}>ID</InputTextForm>
                    <InputTextForm
                        name={"amount"}
                        placeholder={"Кількість"}
                        value={product.amount}
                        onChange={e => setProduct({...product, amount: e.target.value})}>Кількість</InputTextForm>
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
