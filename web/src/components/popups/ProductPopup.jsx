import React from 'react';
import RoundButton from "../UI/buttons/RoundButton";

const ProductPopup = ({setVisible, product}) => {

    return (
        <div>
            {
                product
                    ?
                    <div>
                        <div className="profile-top">
                            <div className="profile-name">{product.name}</div>
                            <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
                        </div>
                        <div className="profile-left">
                            <div className="profile-p">
                                <h3>
                                    Ціна
                                </h3>
                                <hr width="116px"/>
                                <p>
                                    {product.price} гривень
                                </p>
                            </div>
                            <div className="profile-p">
                                <h3>
                                    Кількість
                                </h3>
                                <hr width="116px"/>
                                <p>
                                    {product.count}
                                </p>
                            </div>
                            <div className="profile-p">
                                <h3>
                                    Характеристики
                                </h3>
                                <hr width="116px"/>
                                <p>
                                    {product.characteristics}
                                </p>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="profile-top">
                        <div className="profile-name">Товар не знайдено</div>
                        <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
                    </div>
            }
        </div>
    );
};

export default ProductPopup;
