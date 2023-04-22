import React, {useEffect, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import DateInput from "../components/UI/inputs/date/DateInput";
import axios from "axios";

const Statistics = () => {
    const authToken = localStorage.getItem('authToken');
    const products = JSON.parse(localStorage.getItem('products'));
    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const [upc, setUpc] = useState(undefined);
    const [productCount, setProductCount] = useState(0);
    const [productName, setProductName] = useState(undefined);

    function handleSearch(upc){
        setUpc(upc);
        if (startDate === undefined && endDate===undefined) {
            alert("Введіть дати для пошуку");
        }
    }
    useEffect(() => {
        if (startDate !== undefined && endDate!==undefined) {
            axios
                .get('http://localhost:8082/check/check-item/list', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    params: {
                        storeProductID: upc,
                        startDate: new Date(startDate),
                        endDate:new Date(endDate)
                    }
                })
                .then(response => {
                    if (response.data) {
                        const count = response.data.reduce((total, obj) => {
                            return total + obj.product_count;
                        }, 0);
                        setProductCount(count);
                        setProductName(products.find(obj => obj.upc===upc).name);
                    }else {
                        alert("Товару з таким upc не знайдено або він не продавався у таких проміжках часу");
                    }
                })
        }
    }, [upc]);
    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                    <Searchbar onSearch={handleSearch} placeholder={"Введіть upc товару"}/>
                    <DateInput
                        name={"dateFrom"}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    >З</DateInput>
                    <DateInput
                        name={"dateTo"}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    >до</DateInput>
                </div>
            </div>
            {
                productName!==undefined
                ?
                    <div style={{margin: '10px 30px',}}>
                        <h3 style={{margin: '10px 0',}}>Загальна кількість одиниць певного товару, проданого за певний період часу:</h3>
                        <div>
                            Назва: {productName}
                        </div>
                        <div>
                            Період: з {startDate} до {endDate}
                        </div>
                        <div>
                        Кількість: {productCount} одиниць
                        </div>

                    </div>
                    :
                    null
            }
        </div>
    );
};

export default Statistics;
