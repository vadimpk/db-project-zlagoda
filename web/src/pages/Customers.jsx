import React, {useContext, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from "../assets/images/edit.svg";
import PrintButton from "../components/UI/buttons/PrintButton";

import {ManagerContext} from "../context";

const Customers = () => {
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [searchResults, setSearchResults] = useState([]);
    function handleSearch(searchCust) {
        setSearchResults(searchCust)
    }

    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                    <Searchbar onSearch={handleSearch} placeholder={isManager ? "Введіть відсоток із карти клієнта" : "Введіть прізвище клієнта"}/>
                </div>
                <div className="filter-left">
                    <RoundButton>+</RoundButton>
                    <RoundButton>&minus;</RoundButton>
                    {
                        isManager
                        ?
                            <RoundButton><img src={edit} width="14px" height="12px"/></RoundButton>
                            :
                        null
                    }
                    {
                        isManager
                            ?
                            <PrintButton/>
                            :
                            null
                    }
                </div>
            </div>
            <table className="table-1">
                <tr>
                    <th>Номер карти</th>
                    <th>ПІБ</th>
                    <th>Відсоток</th>
                    <th>Телефон</th>
                    <th>Адреса</th>
                </tr>
                <tr>
                    <td>1234567890123</td>
                    <td>Прізвище Ім'я По-батькові</td>
                    <td>8</td>
                    <td>+380693546856</td>
                    <td>Кам’янець-Подільський, Марини Цвєтаєвої, 24300</td>
                </tr>
                <tr>
                    <td>1234567890123</td>
                    <td>Прізвище Ім'я По-батькові</td>
                    <td>9</td>
                    <td>+380693546856</td>
                    <td>Кам’янець-Подільський, Марини Цвєтаєвої, 24300</td>
                </tr>
                <tr>
                    <td>1234567890123</td>
                    <td>Прізвище Ім'я По-батькові</td>
                    <td>2</td>
                    <td>+380693546856</td>
                    <td>Кам’янець-Подільський, Марини Цвєтаєвої, 24300</td>
                </tr>
            </table>
        </div>
    );
};

export default Customers;
