import React, {useContext, useEffect, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import RoundButton from "../components/UI/buttons/RoundButton";
import PrintButton from "../components/UI/buttons/PrintButton";
import {ManagerContext} from "../context";
import Select from "../components/UI/select/Select";
import DateInput from "../components/UI/inputs/date/DateInput";
import Table from "../components/UI/table/Table";
import moment from "moment";
import Modal from "../components/UI/Modal/Modal";
import CheckPopup from "../components/popups/CheckPopup";
import ModalForm from "../components/UI/Modal/ModalForm";
import CheckProductFormPopup from "../components/popups/CheckProductFormPopup";
import axios from "axios";

const Checks = () => {
    const [modal, setModal] = useState(false);
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const checksHeaders = ['Номер чеку','Дата','Загальна сума','ПДВ'];
    const checkHeaders = ['Назва товару','Кількість','Ціна'];
    const [isOpenSearch, setOpenSearch] = useState(false);
    //EXAMPLE
    const [check, setCheck] = useState([
        {
            name: 'Хлєб',
            amount:36,
            price: 123
        },
        {
            name: 'Мача',
            amount:1,
            price: 823
        },
        {
            name: 'Чай',
            amount:13,
            price: 15
        }
    ])
    const [check1, set1Check] = useState([
        {
            name: 'Шоколадка',
            amount:36,
            price: 123
        },
        {
            name: 'Молоко',
            amount:1,
            price: 823
        },
        {
            name: 'Кава',
            amount:13,
            price: 15
        }
    ])
    const [check2, set2Check] = useState([
        {
            name: 'Сигарети',
            amount:36,
            price: 123
        },
        {
            name: 'Сік',
            amount:1,
            price: 823
        },
        {
            name: 'Рис',
            amount:13,
            price: 15
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
    const [newCheck, setNewCheck] = useState({
        checkNo: '',
        date: new Date(),
        sum:0,
        pdv: 0,
        cashier: '',
        items: []
    })
    const [selectedOption, setSelectedOption] = useState("");
    const sum = checksFiltered.reduce((total, obj) => total + obj.sum, 0);



    function handleSearch(checkNo) {
        const check = checks.find(e => e.checkNo === checkNo)
        if (check===undefined){
            alert("Чеків не знайдено");
        }else {
            const check = checks.find(e => e.checkNo === checkNo)
            setChecksFiltered([check]);
        }
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
    function handleSum() {
        if (startDate===undefined||endDate===undefined){
            alert('Вкажіть дати для підрахунку')
        } else {
            setOpenSearch(true)
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

    function handleAddCheck() {
        setNewCheck({...newCheck, checkNo: '2345678', date: new Date(), cashier: 'Gorban'})
        setModal(true);
    }

    const addProduct = (newProduct) => {
        const price0 = 10*newProduct.amount;
        const c = {
            name: newProduct.name,
            amount: newProduct.amount,
            price: price0
        }
        setNewCheck({
            ...newCheck,
            items: [...newCheck.items, c]
        });
        setModal(false)
    }

    function handleSaveCheck() {
        const total = newCheck.items.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.price;
        }, 0);
        console.log(total)
        newCheck.sum=total;
        newCheck.pdv=total*1.2;
        console.log(newCheck)
        setChecks([...checks, newCheck]);
        setNewCheck({
            checkNo: '',
            date: new Date(),
            sum:0,
            pdv: 0,
            cashier: '',
            items: []
        })
    }
    const postCheck = async (check) => {
        try {
            const response = await axios.post('http://localhost:8082/check', check);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };
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
                        <>
                        <div className="filter-left">
                            <RoundButton onClick={handleDelete}>&minus;</RoundButton>
                            <RoundButton onClick={handleSum}>$</RoundButton>
                            <PrintButton/>
                        </div>
                            <Modal visible={isOpenSearch} setVisible={setOpenSearch}>
                                <CheckPopup setVisible={setOpenSearch} startDate={startDate} endDate={endDate} sum={sum} cashier={selectedOption}/>
                            </Modal>
                    </>
                        :
                        <div className="filter-left">
                            <RoundButton onClick={handleAddCheck}>+</RoundButton>
                        </div>
                }
                <ModalForm visible={modal} setVisible={setModal}>
                    <CheckProductFormPopup setVisible={setModal} create={addProduct}/>
                </ModalForm>
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
                {
                    newCheck.checkNo!==''
                    ?
                        <div style={{ display: 'flex' , flexDirection: "column", alignItems: "center"}}>
                            <Table tableData={checkHeaders} rowData={newCheck.items}/>
                            <PrintButton label="Зберегти" onClick={handleSaveCheck}/>
                        </div>
                        :
                        null
                }
            </div>
        </div>
    );
};

export default Checks;
