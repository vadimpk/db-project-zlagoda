import React, {useEffect, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import DateInput from "../components/UI/inputs/date/DateInput";
import axios from "axios";
import Table from "../components/UI/table/Table";

const Statistics = () => {
    const authToken = localStorage.getItem('authToken');
    const products = JSON.parse(localStorage.getItem('products'));
    const dateS =new Date(2023, 2, 1, 0, 0, 0, 0);
    const [startDate, setStartDate] = useState(dateS);
    const [endDate, setEndDate] = useState(new Date());
    const [startDate1, setStartDate1] = useState(dateS);
    const [endDate1, setEndDate1] = useState(new Date());
    const [startDate2, setStartDate2] = useState(dateS);
    const [endDate2, setEndDate2] = useState(new Date());
    const [startDate3, setStartDate3] = useState(dateS);
    const [endDate3, setEndDate3] = useState(new Date());
    const [startDate4, setStartDate4] = useState(dateS);
    const [endDate4, setEndDate4] = useState(new Date());
    const [startDate5, setStartDate5] = useState(dateS);
    const [endDate5, setEndDate5] = useState(new Date());
    const [startDate6, setStartDate6] = useState(dateS);
    const [endDate6, setEndDate6] = useState(new Date());
    const [upc, setUpc] = useState('121212121212');
    const [productCount, setProductCount] = useState(0);
    const [productName, setProductName] = useState(null);
    const headersCustCat = ["Номер карти", "Прізвище", 'Ім\'я', "По-батькові"];
    const [customersCategory, setCustomersCategory] = useState(null);
    const headersCustCheck = ["Номер карти", "Прізвище", 'Ім\'я', "По-батькові", "Кількість чеків", 'Усього', "Середній чек"];
    const [customersCheck, setCustomersCheck] = useState(null);
    const headersEmplCheck = ["ID", "Прізвище", 'Ім\'я', "Кількість чеків",'Загальна ціна чеків', "Середній чек", "Загальна знижка",'Кількість клієнтів'];
    const [employeesCheck, setEmployeesCheck] = useState(null);
    const headersEmplNoCheck = ['ID','Прізвище','Ім\'я','По-батькові','Посада','Зарплата','Початок роботи','Дата народження','Телефон','Місто','Вулиця','Індекс'];
    const [employeesNoCheck, setEmployeesNoCheck] = useState(null);
    const headersSalesCategory = ['ID','Назва','Загальні продажі','Середня знижка','Кількість проданих товарів','Середня ціна продажу'];
    const [salesCategory, setSalesCategory] = useState(null);

    function handleSearch(upc){
        setUpc(upc);
    }
    useEffect(() => {
            axios
                .get('http://localhost:8082/check/check-item/list', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                    params: {
                        storeProductID: upc,
                        startDate: new Date(startDate),
                        endDate:new Date(endDate)
                    }
                })
                .then(response => {
                    if (response.data) {
                        const count = response.data.reduce((total, obj) => {
                            return total + obj.product_count;
                        }, 0);
                        setProductCount(count);
                        setProductName(products.find(obj => obj.upc===upc).name);
                    }else {
                        alert("Товару з таким upc не знайдено або він не продавався у таких проміжках часу");
                    }
                });
    }, [upc]);
    useEffect(()=>{
            axios.get('http://localhost:8082/statistics/customers-buy-all-categories', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                params: {
                    startDate: new Date(startDate1),
                    endDate:new Date(endDate1)
                }
            }).then(response => {
                setCustomersCategory(response.data);
            }).catch(e => {
                console.log(e);
            });
    }, [startDate1,endDate1]);
    useEffect(()=>{
       axios.get('http://localhost:8082/statistics/customers-checks', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            params: {
                startDate: new Date(startDate2),
                endDate:new Date(endDate2)
            }
        }).then(response => {
            setCustomersCheck(response.data);
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        });
    }, [startDate2,endDate2]);
    useEffect(()=>{
        axios.get('http://localhost:8082/statistics/employees-checks', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            params: {
                startDate: new Date(startDate3),
                endDate:new Date(endDate3)
            }
        }).then(response => {
            setEmployeesCheck(response.data);
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        });
    }, [startDate3,endDate3]);
    useEffect(()=>{
        axios.get('http://localhost:8082/statistics/employees-without-checks', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            params: {
                startDate: new Date(startDate4),
                endDate:new Date(endDate4)
            }
        }).then(response => {
            setEmployeesNoCheck(response.data);
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        });
    }, [startDate4,endDate4]);
    useEffect(()=>{
        axios.get('http://localhost:8082/statistics/sales-by-category', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            params: {
                startDate: new Date(startDate5),
                endDate:new Date(endDate5)
            }
        }).then(response => {
            setSalesCategory(response.data);
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        });
    }, [startDate5,endDate5]);
    useEffect(()=>{

    }, [startDate6,endDate6]);

    const transformEmployees = employeesNoCheck!==null ? employeesNoCheck.map(employee => {
        const { password, ...rest } = employee;
        return rest;
    }) : {};
    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                    <Searchbar onSearch={handleSearch} placeholder={"Введіть upc товару"}/>
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
            </div>
            {
                productName!==null
                ?
                    <div style={{margin: '10px 30px',}}>
                        <h3 style={{margin: '10px 0',}}>Загальна кількість одиниць певного товару, проданого за певний період часу:</h3>
                        <p>
                            Назва: {productName}
                        </p>
                        <p>
                            Період: з {startDate.toLocaleDateString()} до {endDate.toLocaleDateString()}
                        </p>
                        <p>
                        Кількість: {productCount} одиниць
                        </p>

                    </div>
                    :
                    <div>Цей товар не продавався у вказаний період</div>
            }
            <div className="filter">
                <div className="filter-right" style={{marginLeft:'-30px', marginTop: '20px', marginBottom:'-10px'}}>
                    <DateInput
                        name={"dateFrom"}
                        value={startDate1}
                        onChange={(e) => setStartDate1(e.target.value)}
                    >З</DateInput>
                    <DateInput
                        name={"dateTo"}
                        value={endDate1}
                        onChange={(e) => setEndDate1(e.target.value)}
                    >до</DateInput>
                </div>
            </div>
            {
                customersCategory!==null
                ?
                <div>
                    <h3 style={{marginLeft: '30px',marginTop: '30px',}}>Постійні клієнти, які купували товари з усіх категорій:</h3>
                    <Table tableData={headersCustCat} rowData={customersCategory}/>

                </div>
                :
                    <div>Немає клієнтів, які купували товари з усіх категорій у вказані дати</div>
            }
            <div className="filter">
                <div className="filter-right" style={{marginLeft:'-30px', marginTop: '20px', marginBottom:'-10px'}}>
                    <DateInput
                        name={"dateFrom"}
                        value={startDate2}
                        onChange={(e) => setStartDate2(e.target.value)}
                    >З</DateInput>
                    <DateInput
                        name={"dateTo"}
                        value={endDate2}
                        onChange={(e) => setEndDate2(e.target.value)}
                    >до</DateInput>
                </div>
            </div>
            {
                customersCheck!==null
                    ?
                    <div>
                        <h3 style={{marginLeft: '30px',marginTop: '30px',}}>Статистика чеків постійних клієнтів:</h3>
                        <Table tableData={headersCustCheck} rowData={customersCheck}/>

                    </div>
                    :
                    <div>У вказані дати чеків постійних клієнтів немає</div>
            }
            <div className="filter">
                <div className="filter-right" style={{marginLeft:'-30px', marginTop: '20px', marginBottom:'-10px'}}>
                    <DateInput
                        name={"dateFrom"}
                        value={startDate3}
                        onChange={(e) => setStartDate3(e.target.value)}
                    >З</DateInput>
                    <DateInput
                        name={"dateTo"}
                        value={endDate3}
                        onChange={(e) => setEndDate3(e.target.value)}
                    >до</DateInput>
                </div>
            </div>
            {
                employeesCheck!==null
                    ?
                    <div>
                        <h3 style={{marginLeft: '30px',marginTop: '30px',}}>Статистика чеків, які зробили касири:</h3>
                        <Table tableData={headersEmplCheck} rowData={employeesCheck}/>

                    </div>
                    :
                    <div>Касири у вказані дати чеків не зробили</div>
            }
            <div className="filter">
                <div className="filter-right" style={{marginLeft:'-30px', marginTop: '20px', marginBottom:'-10px'}}>
                    <DateInput
                        name={"dateFrom"}
                        value={startDate4}
                        onChange={(e) => setStartDate4(e.target.value)}
                    >З</DateInput>
                    <DateInput
                        name={"dateTo"}
                        value={endDate4}
                        onChange={(e) => setEndDate4(e.target.value)}
                    >до</DateInput>
                </div>
            </div>
            {
                employeesNoCheck!==null
                    ?
                    <div>
                        <h3 style={{marginLeft: '30px',marginTop: '30px',}}>Статистика працівників без чеків:</h3>
                        <Table tableData={headersEmplNoCheck} rowData={transformEmployees}/>

                    </div>
                    :
                    <div>У вказані дати касирів без чеків немає</div>
            }
            <div className="filter">
                <div className="filter-right" style={{marginLeft:'-30px', marginTop: '20px', marginBottom:'-10px'}}>
                    <DateInput
                        name={"dateFrom"}
                        value={startDate5}
                        onChange={(e) => setStartDate5(e.target.value)}
                    >З</DateInput>
                    <DateInput
                        name={"dateTo"}
                        value={endDate5}
                        onChange={(e) => setEndDate5(e.target.value)}
                    >до</DateInput>
                </div>
            </div>
            {
                salesCategory!==null
                    ?
                    <div>
                        <h3 style={{marginLeft: '30px',marginTop: '30px',}}>Статистика продажів за категоріями:</h3>
                        <Table tableData={headersSalesCategory} rowData={salesCategory}/>

                    </div>
                    :
                    <div>Продажів у вказані дати не було здійснено</div>
            }

        </div>
    );
};

export default Statistics;
