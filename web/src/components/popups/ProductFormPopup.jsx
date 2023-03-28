import React, {useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";
import Radio from "../UI/inputs/radio/Radio";
import Checkbox from "../UI/inputs/checkbox/Checkbox";

const ProductFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const [product, setProduct] = useState(selectedRow ||
        {
            ID:'',
            name:'',
            category: '',
            manufacturer:'',
            characteristics:''
        });

    const addNewProduct = (e) => {
        e.preventDefault()
        if (validateForm()) {
            create(product)
        }
        setProduct({
            ID:'',
            name:'',
            category: '',
            manufacturer:'',
            characteristics:''
        });
        setVisible(false)
    }
    const editProduct = (e) => {
        e.preventDefault()
        setProduct({...product, ID: selectedRow.ID})
        if (validateForm()) {
            edit(product, selectedRow.ID)
        }
        setProduct({
            ID:'',
            name:'',
            category: '',
            manufacturer:'',
            characteristics:''
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
                        value={ selectedRow===undefined ? product.ID : selectedRow.ID}
                        onChange={e => setProduct({...product, ID: e.target.value})}>ID</InputTextForm>
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
                <InputTextForm
                    name={"manufacturer"}
                    placeholder={"Виробник"}
                    value={product.manufacturer}
                    onChange={e => setProduct({
                        ...product,
                        manufacturer: e.target.value
                    })}>Виробник</InputTextForm>
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
