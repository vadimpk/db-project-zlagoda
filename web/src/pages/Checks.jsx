import React, {useContext, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from "../assets/images/edit.svg";
import PrintButton from "../components/UI/buttons/PrintButton";
import {ManagerContext} from "../context";
import Select from "../components/UI/select/Select";
import Date from "../components/UI/inputs/date/Date";

const Checks = () => {
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [searchResults, setSearchResults] = useState([]);
    function handleSearch(searchCheck) {
        setSearchResults(searchCheck)
    }

    return (
        <div>
            <Navbar/>
            <div className="filter">
                    <div className="filter-right">
                        {
                    isManager
                    ?
                            <Select>
                                <option>Касир</option>
                                <option>Денисюк</option>
                                <option>Римар</option>
                                <option>Кравець</option>
                            </Select>
                        :
                            <Searchbar onSearch={handleSearch} placeholder={"Введіть номер чеку"}/>
                        }
                        <Date name={"dateFrom"}>З</Date>
                        <Date name={"dateTo"}>до</Date>
                    </div>
                {
                    isManager
                    ?
                        <div className="filter-left">
                            <RoundButton>&minus;</RoundButton>
                            <RoundButton>$</RoundButton>
                            <PrintButton/>
                        </div>
                        :
                        <div className="filter-left">
                            <RoundButton>+</RoundButton>
                        </div>
                }
            </div>
            <div className="two-tables-div">
                <div className="imaginary-margin">
                </div>
            <table className="table-1">
                <tr>
                    <th>Номер чеку</th>
                    <th>Дата</th>
                    <th>Загальна сума</th>
                    <th>ПДВ</th>
                </tr>
                <tr>
                    <td>1234567890</td>
                    <td>2008-11-11 13:23:44</td>
                    <td>1234567890123</td>
                    <td>1234567890123</td>
                </tr>
                <tr>
                    <td>1234567890</td>
                    <td>2008-11-11 13:23:44</td>
                    <td>1234567890123</td>
                    <td>1234567890123</td>
                </tr>
                <tr>
                    <td>1234567890</td>
                    <td>2008-11-11 13:23:44</td>
                    <td>1234567890123</td>
                    <td>1234567890123</td>
                </tr>
            </table>
                <div className="imaginary-margin">
                </div>
            <table className="table-1">
                <tr>
                    <th>Назва товару</th>
                    <th>Кількість</th>
                    <th>Ціна</th>
                </tr>
                <tr>
                    <td>Хліб Київхліб Супер тост світлий нарізаний 350г</td>
                    <td>1000</td>
                    <td>1234567890123</td>
                </tr>
                <tr>
                    <td>Хліб Київхліб Супер тост світлий нарізаний 350г</td>
                    <td>1000</td>
                    <td>1234567890123</td>
                </tr>
                <tr>
                    <td>Хліб Київхліб Супер тост світлий нарізаний 350г</td>
                    <td>1000</td>
                    <td>1234567890123</td>
                </tr>
            </table>
                <div className="imaginary-margin">
                </div>
            </div>
        </div>
    );
};

export default Checks;
