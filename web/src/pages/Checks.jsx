import React, {useContext, useEffect, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import RoundButton from "../components/UI/buttons/RoundButton";
import PrintButton from "../components/UI/buttons/PrintButton";
import Select from "../components/UI/select/Select";
import DateInput from "../components/UI/inputs/date/DateInput";
import Table from "../components/UI/table/Table";
import Modal from "../components/UI/Modal/Modal";
import CheckPopup from "../components/popups/CheckPopup";
import ModalForm from "../components/UI/Modal/ModalForm";
import CheckProductFormPopup from "../components/popups/CheckProductFormPopup";
import axios from "axios";
import SearchInput from "../components/UI/inputs/text-password/SearchInput";
import {handleDownloadPdf, updateProducts} from "../functions";

const Checks = () => {
    const authToken = localStorage.getItem('authToken');
    const employee = JSON.parse(localStorage.getItem('employee'));
    const products = JSON.parse(localStorage.getItem('products'));
    const [modal, setModal] = useState(false);
    const isManager = employee.role!=='Касир';
    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const checksHeaders = ['Номер чеку','Дата','Загальна сума','ПДВ','Карта клієнта'];
    const checksHeadersM = ['Номер чеку','Дата','Загальна сума','ПДВ','Карта клієнта','Касир'];
    const checkHeaders = ['Назва товару','Кількість','Ціна'];
    const [isOpenSearch, setOpenSearch] = useState(false);
    const [checks, setChecks] = useState([])
    const [cashiers, setCashiers] = useState([]);
    const [selectedRow, setSelectedRow] = useState();
    const [selectedCheck, setSelectedCheck] = useState();
    const [selectedCashier, setSelectedCashier] = useState("");
    const [customerId, setCustomerId] = useState('');
    const [customers, setCustomers] = useState([]);
    const transformedData = checks ? checks.map(({ id, date, total_price, vat, customer_card_id, employee_id }) => {
        const cashier = cashiers.find(cashier => cashier.employee_id === employee_id);
        const employeeName = isManager ? (cashier ? cashier.fullName : null) : null;
        return {
            id,
            date,
            total_price,
            vat,
            customer_card_id: customer_card_id ? customer_card_id : 'Відсутня',
            employee_id: employeeName,
        };
    }) : [];

    const [newCheck, setNewCheck] = useState({
        id: '',
        date: new Date(),
        total_price:0,
        vat: 0,
        employee_id: '',
        customer_card_id: undefined,
        items: []
    })
    const sum = checks ? checks.reduce((total, obj) => total + obj.total_price, 0) : 0;

    async function fetchData() {
        try {
            const params = {}
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            if (!isManager) {
                params.employeeID=employee.id;
                params.startDate= currentDate;
            }
            const checksResponse = await axios.get("http://localhost:8082/check", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }, params
            });

            setChecks(checksResponse.data);

            const cashiersResponse = await axios.get(
                "http://localhost:8082/employee",
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    params: {
                        role: "Касир",
                    },
                }
            );
            const cashiers1 = cashiersResponse.data.map(
                (cashier) => ({
                    employee_id: cashier.id,
                    fullName: `${cashier.surname} ${cashier.name} ${cashier.patronymic}`
                })
            );
            setCashiers(cashiers1);
            await updateProducts();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
        axios.get('http://localhost:8082/customer-card', {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            params: {
                sortAscending: true,
                sortSurname: true
            }
        })
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if ((startDate !== undefined && endDate !== undefined)||(selectedCashier.employee_id !== "" && isManager)) {
        const params = {};
        if (startDate !== undefined && endDate !== undefined) {
            params.startDate = new Date(startDate);
            params.endDate = new Date(endDate);
        }
        if (selectedCashier.employee_id !== "" && isManager) {
            params.employeeID = selectedCashier.employee_id;
        } else {
            params.employeeID = employee.id;
        }
        axios.get("http://localhost:8082/check", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            params
        }).then(response => {
            if (response.data === null) {
                setChecks([]);
            }
            console.log(response.data)
            setChecks(response.data);
        })
    }
    }, [startDate, endDate, selectedCashier])
    useEffect(() => {
        let data;
        if (selectedRow !== undefined) {
            axios
                .get('http://localhost:8082/check/check-item/list', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    params: {
                        checkID: selectedRow.id
                    }
                })
                .then(response => {
                    data = response.data
                    if(data!==null) {
                        const transformedData = data.map(({id, product_count, product_price}) => {
                            const {
                                upc,
                                name,
                                product_price: storeProductPrice
                            } = products.find(p => p.upc === id.store_product_id);
                            return {
                                name,
                                product_count,
                                product_price: storeProductPrice || product_price,
                            };
                        });
                        setSelectedCheck(transformedData)
                    }else {
                        console.log(response.data);
                        alert('Чек пустий');

                    }
                })
        }
    }, [selectedRow]);

    function handleSearch(id) {
        setSelectedRow(prevState => {
            return {
                ...prevState,
                id: id
            };
        });
    }
    function handleDelete() {
        if (selectedRow===undefined){
            alert('Виберіть чек для видалення')
        } else {
            axios.delete(`http://localhost:8082/check/${selectedRow.id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            }).then(response => {
                console.log(response.data);
            }).catch(e => {
                alert('Видалення відхилене сервером')
                console.log(e);
            })
        }
    }
    function handleSum() {
        if (startDate===undefined||endDate===undefined){
            alert('Вкажіть дати для підрахунку')
        } else {
            setOpenSearch(true)
        }
    }
    function handleAddCheck() {
        if (newCheck.id==='') {
            setNewCheck({...newCheck, date: new Date(), employee_id: employee.id})
            const check = {
                date: newCheck.date,
                total_price: 0,
                vat: 0,
                employee_id: employee.id,
                ...(customerId && { customer_card_id: customerId })
            }
            axios.post('http://localhost:8082/check', check, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
                .then(response => {
                    setNewCheck({...newCheck, id: response.data.id})
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error)
                    alert('Такої карти клієнта не існує')
                    setModal(false);
                    return;
                })
        }
        setModal(true);
        setCustomerId('');
        setWordEntered('');
    }

    const addProduct = (newProduct) => {
        try {
            const match = products.find((product) => product.upc === newProduct.store_product_id);
        const c = {
            id: {
                check_id: newCheck.id,
                store_product_id: newProduct.store_product_id
            },
            product_count: newProduct.product_count,
            product_price: match.product_price
        }
        axios.post('http://localhost:8082/check/check-item',c,{
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        }).then(response => {
            console.log(response.data)
        }).catch( error => {
            alert('Неправильний UPC товару')
            console.log(error)
        })
        setNewCheck({
            ...newCheck,
            items: [...newCheck.items, {
                name: match.name,
                product_count: newProduct.product_count,
                product_price: match.product_price
            }]
        });
        setModal(false)
        } catch (e) {
            alert('Товар не знайдено')
            console.log(e)
        }
    }
    function handleSaveCheck() {
        console.log(newCheck);
        setNewCheck({
            id: '',
            date: new Date(),
            sum:0,
            pdv: 0,
            cashier: '',
            items: []
        });
    }
    const printRef = React.useRef();
    function handlePrint(){
        handleDownloadPdf(printRef,'Checks');
    }

    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [wordEntered, setWordEntered] = useState('');

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = customers.filter((value) => {
            return value.surname.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord === "") {
            setFilteredCustomers([]);
        } else {
            setFilteredCustomers(newFilter);
        }
    };
    const handleSelectedCustomer = (id) => {
        setCustomerId(id);
        setWordEntered(id);
        setFilteredCustomers([]);
    };
    return (
        <div>
            <Navbar/>
            <div className="filter">
                    <div className="filter-right">
                        {
                    isManager
                    ?
                        <Select value={JSON.stringify(selectedCashier)} onChange={(e) => setSelectedCashier(JSON.parse(e.target.value))}>
                            {
                                cashiers.map((item, index) => (
                                    <option key={index} value={JSON.stringify({ employee_id: item.employee_id, fullName: item.fullName })}>
                                        {item.fullName}
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
                            <PrintButton onClick={handlePrint}/>
                        </div>
                            <Modal visible={isOpenSearch} setVisible={setOpenSearch}>
                                <CheckPopup setVisible={setOpenSearch} startDate={startDate} endDate={endDate} sum={sum} cashier={selectedCashier.fullName}/>
                            </Modal>
                    </>
                        :
                        <div className="filter-left" style={{position: 'relative', margin:'10px 0'}}>
                            <SearchInput
                                placeholder={"Введіть номер карти клієнта"}
                                value={wordEntered}
                                onChange={handleFilter}
                                showMagnifier={true}
                            />
                            {filteredCustomers.length != 0 && (
                                <div className="dataResult">
                                    {filteredCustomers.map((value, key) => {
                                        return (
                                            <p className="dataItem" key={key} onClick={() => handleSelectedCustomer(value.id)}>
                                                {value.surname} {value.name} {value.patronymic}
                                            </p>
                                        );
                                    })}
                                </div>
                            )}
                            <RoundButton onClick={handleAddCheck}>+</RoundButton>
                        </div>
                }
                <ModalForm visible={modal} setVisible={setModal}>
                    <CheckProductFormPopup setVisible={setModal} create={addProduct}/>
                </ModalForm>
            </div>
            <div className="two-tables-div">
                <div ref={printRef}>
                <Table
                    tableData={ isManager ? checksHeadersM : checksHeaders}
                    rowData={transformedData}
                    setSelectedRow={setSelectedRow}/>
                </div>
                {
                    selectedCheck!==undefined
                    ?
                    <Table tableData={checkHeaders} rowData={selectedCheck}/>
                    :
                    null
                }
                {
                    newCheck.id!==''
                    ?
                        <div style={{ display: 'flex', flexDirection: "column", alignItems: "center"}}>
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
