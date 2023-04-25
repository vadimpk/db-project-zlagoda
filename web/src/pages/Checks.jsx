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
            const currentDate = new Date().toISOString().slice(0, 10);
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
    }, []);
    useEffect(() => {
        const params = {};
        if (startDate!==undefined&&endDate!==undefined) {
            params.startDate = new Date(startDate);
            params.endDate = new Date(endDate);
        }
        if(selectedCashier.employee_id!==""){
            params.employeeID = selectedCashier.employee_id;
        }
            axios.get("http://localhost:8082/check", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                params
            }).then(response => {
                if(response.data===null){
                    setChecks([]);
                }
                setChecks(response.data);
            })
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
                        alert('Чеків з таким номером немає');
                        setSelectedCheck();
                    }
                })
        }
    }, [selectedRow]);

    async function updateProducts() {
        const productsResponse = await axios.get("http://localhost:8082/product", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        const arr1 = productsResponse.data.map(({ id, name }) => ({ id, name }));

        const storeResponse = await axios.get(
            "http://localhost:8082/product/store",
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        const arr2 = storeResponse.data.map(({ id, product_id, price }) => ({
            upc: id,
            id: product_id,
            product_price: price
        }));

        const result = [];
        arr1.forEach(item1 => {
            const matches = arr2.filter(item2 => item2.id === item1.id);
            if (matches.length === 0) {
                result.push({
                    name: item1.name,
                    upc: null,
                    product_price: null
                });
            } else {
                matches.forEach(match => {
                    result.push({
                        name: item1.name,
                        upc: match.upc,
                        product_price: match.product_price
                    });
                });
            }
        });

        localStorage.setItem("products", JSON.stringify(result));
    }

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
                            <PrintButton/>
                        </div>
                            <Modal visible={isOpenSearch} setVisible={setOpenSearch}>
                                <CheckPopup setVisible={setOpenSearch} startDate={startDate} endDate={endDate} sum={sum} cashier={selectedCashier.fullName}/>
                            </Modal>
                    </>
                        :
                        <div className="filter-left">
                            <SearchInput
                                placeholder={"Введіть номер карти клієнта"}
                                value={customerId}
                                onChange={event => setCustomerId(event.target.value)}
                                showMagnifier={true}
                            />
                            <RoundButton onClick={handleAddCheck}>+</RoundButton>
                        </div>
                }
                <ModalForm visible={modal} setVisible={setModal}>
                    <CheckProductFormPopup setVisible={setModal} create={addProduct}/>
                </ModalForm>
            </div>
            <div className="two-tables-div">
                <Table
                    tableData={ isManager ? checksHeadersM : checksHeaders}
                    rowData={transformedData}
                    setSelectedRow={setSelectedRow}/>
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
