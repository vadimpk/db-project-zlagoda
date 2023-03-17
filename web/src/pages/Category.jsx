import React from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from "../assets/images/edit.svg";
import PrintButton from "../components/UI/buttons/PrintButton";
import Select from "../components/UI/select/Select";

const Category = () => {
    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                    <PrintButton/>
                    <RoundButton><img src={edit} width="14px" height="12px"/></RoundButton>
                    <RoundButton>&minus;</RoundButton>
                    <RoundButton>+</RoundButton>
                </div>
                <div className="filter-left">
                    <Select>
                        <option>Категорія</option>
                        <option>Бакалія</option>
                        <option>Молочні продукти</option>
                        <option>Напої</option>
                    </Select>
                    <RoundButton>+</RoundButton>
                    <RoundButton>&minus;</RoundButton>
                    <RoundButton><img src={edit} width="14px" height="12px"/></RoundButton>
                    <PrintButton/>
                </div>
            </div>
            <div className="two-tables-div">
                <div className="imaginary-margin">
                </div>
                <table className="table-1">
                    <tr>
                        <th>Номер</th>
                        <th>Назва категорії</th>
                    </tr>
                    <tr>
                        <td>1234567890</td>
                        <td>Тютюнові вироби</td>
                    </tr>
                    <tr>
                        <td>1234567890</td>
                        <td>Тютюнові вироби</td>
                    </tr>
                    <tr>
                        <td>1234567890</td>
                        <td>Тютюнові вироби</td>
                    </tr>
                </table>
                <div className="imaginary-margin">
                </div>
                <table className="table-1">
                    <tr>
                        <th>ID</th>
                        <th>Назва</th>
                        <th>Виробник</th>
                        <th>Характеристики</th>
                    </tr>
                    <tr>
                        <td>1234567890</td>
                        <td>Хліб Київхліб Супер тост світлий нарізаний 350г</td>
                        <td>ТД «Золотий Урожай»</td>
                        <td>Тостовий різаний хліб ідеально підходить для смаження на сковороді та приготування тостів.</td>
                    </tr>
                    <tr>
                        <td>1234567890</td>
                        <td>Хліб Київхліб Супер тост світлий нарізаний 350г</td>
                        <td>ТД «Золотий Урожай»</td>
                        <td>Тостовий різаний хліб ідеально підходить для смаження на сковороді та приготування тостів.</td>
                    </tr>
                    <tr>
                        <td>1234567890</td>
                        <td>Хліб Київхліб Супер тост світлий нарізаний 350г</td>
                        <td>ТД «Золотий Урожай»</td>
                        <td>Тостовий різаний хліб ідеально підходить для смаження на сковороді та приготування тостів.</td>
                    </tr>
                </table>
                <div className="imaginary-margin">
                </div>
            </div>
        </div>
    );
};

export default Category;
