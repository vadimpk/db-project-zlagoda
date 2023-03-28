import React, {useContext, useEffect, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from "../assets/images/edit.svg";
import PrintButton from "../components/UI/buttons/PrintButton";
import {ManagerContext} from "../context";
import Select from "../components/UI/select/Select";
import DateInput from "../components/UI/inputs/date/DateInput";
import Table from "../components/UI/table/Table";
import moment from "moment";

const Checks = () => {
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const checksHeaders = ['Номер чеку','Дата','Загальна сума','ПДВ'];
    const checkHeaders = ['Назва товару','Кількість','Ціна'];
    //EXAMPLE
    const [check, setCheck] = useState([
        {
            name: 'Хлєб',
            amount:'36',
            price: '123'
        },
        {
            name: 'Мача',
            amount:'1',
            price: '823'
        },
        {
            name: 'Чай',
            amount:'13',
            price: '15'
        }
    ])
    const [check1, set1Check] = useState([
        {
            name: 'Шоколадка',
            amount:'36',
            price: '123'
        },
        {
            name: 'Молоко',
            amount:'1',
            price: '823'
        },
        {
            name: 'Кава',
            amount:'13',
            price: '15'
        }
    ])
    const [check2, set2Check] = useState([
        {
            name: 'Сигарети',
            amount:'36',
            price: '123'
        },
        {
            name: 'Сік',
            amount:'1',
            price: '823'
        },
        {
            name: 'Рис',
            amount:'13',
            price: '15'
        }
    ])
    const [checks, setChecks] = useState([
        {
            checkNo: '11111',
            date: new Date('2021-03-03'),
            sum:689,
            pdv: 10,
            cashier: 'Римар',
            items: check
        },
        {
            checkNo: '22222',
            date: new Date('2022-06-07'),
            sum: 369,
            pdv: 56,
            cashier: 'Палій',
            items: check1
        },
        {
            checkNo: '33333',
            date: new Date('2012-01-01'),
            sum: 7925,
            pdv: 96,
            cashier: 'Денисюк',
            items: check2
        }
    ])
    const cashiers = ['Касир','Денисюк','Палій','Римар'];
    //EXAMPLE END
    const [selectedRow, setSelectedRow] = useState({
        checkNo: '',
        date: null,
        sum: 0,
        pdv: 0
    });
    const [checksFiltered, setChecksFiltered] = useState(checks);
    const checksTable = checksFiltered.map(({ checkNo, date, sum, pdv }) => ({
        checkNo,
        date: date.toLocaleDateString(),
        sum,
        pdv,
    }))
    const [searchResults, setSearchResults] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");



    function handleSearch(searchCheck) {
        setSearchResults(searchCheck)
    }
    function handleSelect (category) {
        setSelectedOption(category);
    }
    function handleDelete() {
        if (selectedRow.checkNo===''){
            alert('Виберіть чек для видалення')
        } else {
            setChecks(prevChecks => prevChecks.filter(check => check.checkNo !== selectedRow.checkNo));
        }
    }
    useEffect(() => {
        const filtered = checks.filter(check => {
            if (selectedOption === 'Касир') {
                return true;
            }
            if (selectedOption) {
                return check.cashier === selectedOption;
            }
           if (startDate && check.date && endDate) {
                const checkDate = moment(check.date);
                const startD = moment(startDate);
                const endD = moment(endDate);
                return checkDate.isBetween(startD, endD);
            }
            return !selectedOption && !startDate && !endDate;
        });

        setChecksFiltered(filtered);
    }, [checks, selectedOption, startDate, endDate]);

    return (
        <div>
            <Navbar/>
            <div className="filter">
                    <div className="filter-right">
                        {
                    isManager
                    ?
                        <Select value={selectedOption} onChange={(e) => handleSelect(e.target.value)}>
                            {
                                cashiers.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))
                            }
                        </Select>
                        :
                            <Searchbar onSearch={handleSearch} placeholder={"Введіть номер чеку"}/>
                        }
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
                {
                    isManager
                    ?
                        <div className="filter-left">
                            <RoundButton onClick={handleDelete}>&minus;</RoundButton>
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
                <Table
                    tableData={checksHeaders}
                    rowData={checksTable}
                    setSelectedRow={setSelectedRow}/>
                {
                    selectedRow.checkNo!==''&&checks.find(check => check.checkNo===selectedRow.checkNo)!==undefined
                    ?
                    <Table tableData={checkHeaders} rowData={checks.find(check => check.checkNo===selectedRow.checkNo).items}/>
                    :
                    null
                }
            </div>
        </div>
    );
};

export default Checks;
