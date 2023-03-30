import React, {useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";

const ProductFormPopup = ({setVisible, create}) => {
    const [product, setProduct] = useState(
        {
            name:'',
            amount: 0
        });

    const addNewProduct = (e) => {
        e.preventDefault()
        create(product)
        setProduct({
            name:'',
            amount: 0
        });
        setVisible(false)
    }

    return (
        <form>
            <div className="form-top">
                <h3>Додати товар</h3>
                <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
            </div>
            <div className="form-main">
                <div className="form-content">
                    <InputTextForm
                        name={"name"}
                        placeholder={"Назва"}
                        value={product.name}
                        onChange={e => setProduct({
                            ...product,
                            name: e.target.value
                        })}>Назва</InputTextForm>
                    <InputTextForm
                        name={"amount"}
                        placeholder={"Кількість"}
                        value={ product.amount}
                        onChange={e => setProduct({...product, amount: e.target.value})}>Кількість
                    </InputTextForm>
                </div>
            </div>

            <BigButton onClick={addNewProduct}>Додати</BigButton>

        </form>
    );
};

export default ProductFormPopup;
