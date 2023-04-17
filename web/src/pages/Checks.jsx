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
    const authToken = localStorage.getItem('authToken');
    const employee = JSON.parse(localStorage.getItem('employee'));
    const [modal, setModal] = useState(false);
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const checksHeaders = ['Номер чеку','Дата','Загальна сума','ПДВ'];
    const checkHeaders = ['Назва товару','Кількість','Ціна'];
    const [isOpenSearch, setOpenSearch] = useState(false);
    const [checks, setChecks] = useState([])
    const [cashiers, setCashiers] = useState([]);
    const [selectedRow, setSelectedRow] = useState({
        id: '',
        date: null,
        sum: 0,
        pdv: 0
    });
    const [checksFiltered, setChecksFiltered] = useState(checks);
    const checksTable = checksFiltered.map(({ id, date, sum, pdv }) => ({
        id,
        date: date.toLocaleDateString(),
        sum,
        pdv,
    }))
    const [newCheck, setNewCheck] = useState({
        id: '',
        date: new Date(),
        total_price:0,
        vat: 0,
        employee_id: '',
        customer_card_id: undefined,
        items: []
    })

    const [selectedOption, setSelectedOption] = useState("");
    const sum = checksFiltered.reduce((total, obj) => total + obj.sum, 0);

    useEffect(() => {
        axios.get('http://localhost:8082/check', {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                setChecks(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        axios.get('http://localhost:8082/employee', {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            params: {
                role: 'Касир'
            }
        })
            .then(response => {
                const cashiersSurnames = response.data.map(cashier => cashier.surname);
                setCashiers(cashiersSurnames);
            })
            .catch(error => {
                console.log(error);
            });
        setIsManager(false)
        console.log(isManager)
    }, []);


    function handleSearch(id) {
        /*const check = checks.find(e => e.id === id)
        if (check===undefined){
            alert("Чеків не знайдено");
        }else {
            const check = checks.find(e => e.id === id)
            setChecksFiltered([check]);
        }*/
    }
    function handleSelect (category) {
        setSelectedOption(category);
    }
    function handleDelete() {
        /*if (selectedRow.id===''){
            alert('Виберіть чек для видалення')
        } else {
            setChecks(prevChecks => prevChecks.filter(check => check.id !== selectedRow.id));
        }*/
    }
    function handleSum() {
        if (startDate===undefined||endDate===undefined){
            alert('Вкажіть дати для підрахунку')
        } else {
            setOpenSearch(true)
        }
    }

    function handleAddCheck() {
        setNewCheck({...newCheck, date: new Date(), employee_id: employee.id})
        const check = {
            date: newCheck.date,
            total_price:0,
            vat: 0,
            employee_id: employee.id
        }
        axios.post('http://localhost:8082/check', check, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                console.log(response.data)
            })
            .catch( error => {
                console.log(error)
                alert('Не вдалось створити чек')
            })
        setModal(true);
    }

    const addProduct = (newProduct) => {
        let upc, price;
        axios.get(`http://localhost:8082/product/store/${newProduct.store_product_id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                upc = response.data.id;
                price = response.data.price;

            })
            .catch(error => {
                alert('Товар не знайдено')
                console.log(error);
            });
        const c = {
            id: {
                check_id: newCheck.id,
                store_product_id: newProduct.store_product_id
            },
            product_count: newProduct.product_count,
            product_price: price
        }
        axios.post('http://localhost:8082/check/check-item',c,{
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        }).then(response => {
            console.log(response.data)
        }).catch( error => {
            alert('Не вдалось додати товар')
            console.log(error)
        })
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
            id: '',
            date: new Date(),
            sum:0,
            pdv: 0,
            cashier: '',
            items: []
        })
    }

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
                    selectedRow.id!==''&&checks.find(check => check.id===selectedRow.id)!==undefined
                    ?
                    <Table tableData={checkHeaders} rowData={checks.find(check => check.id===selectedRow.id).items}/>
                    :
                    null
                }
                {
                    newCheck.id!==''
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
