import React, { useState } from "react";
import classes from "../inputs/text-password/BigInput.module.css";

function DropSearch({ placeholder, data, children, setProduct, product, setParam}) {
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState('');

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = data.filter((value) => {
            return value.name.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    };

    const handleSelect = (upc) => {
        setProduct({
            ...product,
            store_product_id: upc
        });
        setWordEntered(upc);
        setFilteredData([]);
    };

    return (
        <div className={classes.div} style={{position: 'relative', margin:'10px 0'}}>
            <label>{children}</label>
            <input
                type="text"
                placeholder={placeholder}
                value={wordEntered}
                onChange={handleFilter}
            />
            {filteredData.length != 0 && (
                <div className="dataResult">
                    {filteredData.map((value, key) => {
                        return (
                            <p className="dataItem" key={key} onClick={() => handleSelect(value.upc)}>
                                {value.name}
                            </p>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default DropSearch;
