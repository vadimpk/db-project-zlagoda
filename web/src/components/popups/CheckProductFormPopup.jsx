import React, {useEffect, useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";
import {updateProducts} from "../../functions";
import DropSearch from "../UI/SearchBar/DropSearch";

const ProductFormPopup = ({setVisible, create}) => {
    const products = JSON.parse(localStorage.getItem('products'));
    const [product, setProduct] = useState(
        {
            store_product_id:'',
            product_count: 0
        });
    const addNewProduct = (e) => {
        e.preventDefault();
        if(validateForm()) {
            const product_count = parseFloat(product.product_count);
            product.product_count=product_count;
            create(product);
        }
        setProduct({
            store_product_id:'',
            product_count: 0
        });
        setVisible(false)
    }

    useEffect(() => {
        updateProducts();
    }, []);
    const validateForm = () => {
        const errors ={};
        const pricePattern = /^\d+(\.\d+)?$/; // дозволено тільки цифри та десяткові точки

        if (!pricePattern.test(product.product_count)) {
            errors.product_count="Кількість має бути додатнім числом";
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
                <h3>Додати товар</h3>
                <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
            </div>
            <div className="form-main">
                <div className="form-content">
                    <DropSearch data={products} placeholder={'Введіть назву'} setProduct={setProduct} product={product}>UPC</DropSearch>
                    <InputTextForm
                        name={"product_count"}
                        placeholder={"Кількість"}
                        value={ product.product_count}
                        onChange={e => setProduct({...product, product_count: e.target.value})}>Кількість
                    </InputTextForm>
                </div>
            </div>

            <BigButton onClick={addNewProduct}>Додати</BigButton>

        </form>
    );
};

export default ProductFormPopup;
