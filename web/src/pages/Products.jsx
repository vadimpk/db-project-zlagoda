import React, {useContext, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from "../assets/images/edit.svg";
import PrintButton from "../components/UI/buttons/PrintButton";
import {ManagerContext} from "../context";
import Select from "../components/UI/select/Select";

const Products = () => {
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [searchResults, setSearchResults] = useState([]);
    function handleSearch(searchProd) {
        setSearchResults(searchProd)
    }
    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                    <Searchbar onSearch={handleSearch} placeholder={"Введіть UPC товару"}/>
                    <Checkbox name={"sale"}>Акційні товари</Checkbox>
                    <Checkbox name={"nosale"}>Не акційні товари</Checkbox>
                </div>
                    {
                     isManager
                     ?
                         <div className="filter-left">
                         <RoundButton>+</RoundButton>
                        <RoundButton>&minus;</RoundButton>
                        <RoundButton><img src={edit} width="14px" height="12px"/></RoundButton>
                        <PrintButton/>
                         </div>
                     :
                         <div className="filter-left">
                        <Select>
                        <option>Категорія</option>
                        <option>Бакалія</option>
                        <option>Молочні продукти</option>
                        <option>Напої</option>
                        </Select>
                         </div>
                    }
            </div>
            <table className="table-1">
                <tr>
                    <th>UPC</th>
                    <th>Назва</th>
                    <th>Кількість</th>
                    <th>Ціна</th>
                    <th>Категорія</th>
                    <th>Виробник</th>
                    <th>Характеристика</th>
                </tr>
                <tr>
                    <td>123456789012</td>
                    <td>Хліб Київхліб Супер тост світлий нарізаний 350г</td>
                    <td>115</td>
                    <td>88936,05</td>
                    <td>Бакалія</td>
                    <td>ТД «Золотий Урожай»</td>
                    <td>Тостовий різаний хліб ідеально підходить для смаження на сковороді та приготування тостів.</td>
                </tr>
                <tr>
                    <td>123456789012</td>
                    <td>Хліб Київхліб Супер тост світлий нарізаний 350г</td>
                    <td>115</td>
                    <td>88936,05</td>
                    <td>Бакалія</td>
                    <td>ТД «Золотий Урожай»</td>
                    <td>Тостовий різаний хліб ідеально підходить для смаження на сковороді та приготування тостів.</td>
                </tr>
                <tr>
                    <td>123456789012</td>
                    <td>Хліб Київхліб Супер тост світлий нарізаний 350г</td>
                    <td>115</td>
                    <td>88936,05</td>
                    <td>Бакалія</td>
                    <td>ТД «Золотий Урожай»</td>
                    <td>Тостовий різаний хліб ідеально підходить для смаження на сковороді та приготування тостів.</td>
                </tr>
            </table>
        </div>
    );
};

export default Products;
