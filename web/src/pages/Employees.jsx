import React, {useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from '../components/UI/SearchBar/Searchbar';
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import PrintButton from "../components/UI/buttons/PrintButton";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from  '../assets/images/edit.svg'

const Employees = () => {
    const [searchResults, setSearchResults] = useState([]);
    function handleSearch(searchEmpl) {
        setSearchResults(searchEmpl)
    }

    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                <Searchbar onSearch={handleSearch} placeholder={"Пошук працівника"}/>
                <Checkbox name={"cashier"}>Касир</Checkbox>
                </div>
                <div className="filter-left">
                <RoundButton>+</RoundButton>
                <RoundButton>&minus;</RoundButton>
                <RoundButton><img src={edit} width="14px" height="12px"/></RoundButton>
                <PrintButton/>
                </div>
            </div>
            <table className="table-1">
                <tr>
                    <th>ID</th>
                    <th>ПІБ</th>
                    <th>Посада</th>
                    <th>Зарплата</th>
                    <th>Початок роботи</th>
                    <th>Дата народження</th>
                    <th>Телефон</th>
                    <th>Адреса</th>
                </tr>
                <tr>
                    <td>1234567890</td>
                    <td>Прізвище Ім'я По-батькові</td>
                    <td>Касир</td>
                    <td>15 999</td>
                    <td>22.10.2021</td>
                    <td>03.03.1990</td>
                    <td>+380693546856</td>
                    <td>Кам’янець-Подільський, Марини Цвєтаєвої, 24300</td>
                </tr>
                <tr>
                    <td>1234567890</td>
                    <td>Прізвище Ім'я По-батькові</td>
                    <td>Касир</td>
                    <td>15 999</td>
                    <td>22.10.2021</td>
                    <td>03.03.1990</td>
                    <td>+380693546856</td>
                    <td>Кам’янець-Подільський, Марини Цвєтаєвої, 24300</td>
                </tr>
                <tr>
                    <td>1234567890</td>
                    <td>Прізвище Ім'я По-батькові</td>
                    <td>Касир</td>
                    <td>15 999</td>
                    <td>22.10.2021</td>
                    <td>03.03.1990</td>
                    <td>+380693546856</td>
                    <td>Кам’янець-Подільський, Марини Цвєтаєвої, 24300</td>
                </tr>
            </table>
        </div>
    );
};

export default Employees;
