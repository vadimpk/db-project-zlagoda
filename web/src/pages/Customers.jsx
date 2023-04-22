import React, {useContext, useEffect, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from "../assets/images/edit.svg";
import PrintButton from "../components/UI/buttons/PrintButton";

import {ManagerContext} from "../context";
import Table from "../components/UI/table/Table";
import EmployeeFormPopup from "../components/popups/EmployeeFormPopup";
import ModalForm from "../components/UI/Modal/ModalForm";
import CustomerFormPopup from "../components/popups/CustomerFormPopup";
import axios from "axios";

const Customers = () => {
    const authToken = localStorage.getItem('authToken');
    const employee = JSON.parse(localStorage.getItem('employee'));
    const isManager = employee.role!=='Касир';
    const [modal, setModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const tableData = ['Номер карти','Прізвище','Ім\'я','По-батькові','Телефон','Місто','Вулиця','Індекс','Відсоток']
    const [selectedRow, setSelectedRow] = useState({
        id: '',
        name: '',
        surname:'',
        patronymic:'',
        discount: 0,
        phone_number: '',
        city: '',
        street: '',
        zip_code: ''
    });

    const [customers, setCustomers] = useState([]);
    useEffect(() => {
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

    function handleSearch(param) {
        const params={
            sortAscending: true,
            sortSurname: true,
        };
        if(isManager){
            params.discount=param;
        }else {
            params.search=param;
        }
        axios.get('http://localhost:8082/customer-card', {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            params
        })
            .then(response => {
                if(response.data===null){
                    alert('Таких постійних клієнтів не знайдено');
                } else {
                    setCustomers(response.data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    function handleAdd() {
        setIsEditing(false);
        setModal(true);
    }
    function handleEdit() {
        if (selectedRow.id===''){
            alert('Виберіть клієнта для редагування')
        } else {
            setIsEditing(true);
            setModal(true)
        }
    }
    function handleDelete() {
        if (selectedRow.id===''){
            alert('Виберіть клієнта для видалення')
        } else {
            axios.delete(`http://localhost:8082/customer-card/${selectedRow.id}`,{
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    alert('Сервер відхилив ваш запит на видалення')
                    console.log(error);
                });
        }
    }
    const createCustomer = (newCustomer) => {
        axios.post('http://localhost:8082/customer-card', newCustomer, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                alert('Такий клієнт уже існує')
                console.log(error);
            });

        setModal(false)
    }
    const editCustomer = (newCustomer, id) => {
        newCustomer.id=id
        axios.put(`http://localhost:8082/customer-card/${id}`, newCustomer,{
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                alert('Такий клієнт уже існує')
                console.log(error);
            });
        setModal(false)
    }
    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                    <Searchbar onSearch={handleSearch} placeholder={isManager ? "Введіть відсоток із карти клієнта" : "Введіть прізвище клієнта"}/>
                </div>
                <div className="filter-left">
                    <RoundButton onClick={handleAdd}>+</RoundButton>
                    <RoundButton onClick={handleDelete}>&minus;</RoundButton>
                    {
                        isManager
                        ?
                            <>
                                <RoundButton onClick={handleEdit}><img src={edit} width="14px" height="12px"/></RoundButton>
                                <PrintButton/>
                            </>
                            :
                        null
                    }
                    <ModalForm visible={modal} setVisible={setModal}>
                        <CustomerFormPopup setVisible={setModal} create={createCustomer} edit={editCustomer} selectedRow={isEditing  ? customers.find(customer => customer.id === selectedRow.id):undefined}/>
                    </ModalForm>
                </div>
            </div>
            <Table tableData={tableData} rowData={customers} setSelectedRow={setSelectedRow}/>
        </div>
    );
};

export default Customers;
