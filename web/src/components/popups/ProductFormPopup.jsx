import React, {useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";

const ProductFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const [product, setProduct] = useState(selectedRow ||
        {
            id:0,
            name:'',
            category_id: 0,
            characteristics:''
        });

    const addNewProduct = (e) => {
        e.preventDefault()
        if (validateForm()) {
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
    const validateForm = () => {
        const errors = {};

        if (!/^\d+$/.test(product.id)) {
            errors.id = "ID повинен складатися тільки з цифр";
        }
        if (product.name.length > 50) {
            errors.name = "Назва повинна бути не більше 50 символів";
        }
        if (product.characteristics.length > 100) {
            errors.characteristics = "Характеристика повинна бути не більше 100 символів";
        }
        if (!/^[\p{L}\d\s.,-]+$/u.test(product.name)) {
            errors.name = "Назва має містити тільки букви, цифри, коми, крапки та тире";
        }
        if (!/^[\p{L}\d\s.,-]+$/u.test(product.characteristics)) {
            errors.characteristics = "Характеристика має містити тільки букви, цифри, коми, крапки та тире";
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
                        value={ selectedRow===undefined ? product.id : selectedRow.id}
                        onChange={e => setProduct({...product, id: e.target.value})}>id</InputTextForm>
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
                    {/*<InputTextForm
                    name={""}
                    placeholder={"Виробник"}
                    value={product.manufacturer}
                    onChange={e => setProduct({
                        ...product,
                        manufacturer : e.target.value
                    })}>Виробник</InputTextForm>*/}
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
