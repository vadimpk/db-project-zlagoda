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
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [modal, setModal] = useState(false);
    const tableData = ['Номер карти','ПІБ','Відсоток','Телефон','Адреса']
    const [selectedRow, setSelectedRow] = useState({
        id: '',
        fullName: '',
        discount: 0,
        phone: '',
        address: ''
    });
    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8082/customer-card', {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            params: {
                ascending: true
            }
        })
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    function transformData(data) {
        return data.map((item) => {
            const {city, street, zipCode} = item.address;
            const addressString = Object.values(item.address).join(', ');
            const {surname, name, lastName} = item.fullName;
            const fullNameString = [surname, name, lastName].filter(Boolean).join(' ');
            return {
                ...item,
                fullName: fullNameString,
                address: addressString
            };
        });
    }

    function handleSearch(discount) {
        setCustomers(customers.filter( c => c.discount===discount))
    }
    function handleAdd() {
        setSelectedRow(undefined);
        setModal(true);
    }
    function handleEdit() {
        if (selectedRow.id===''){
            alert('Виберіть клієнта для редагування')
        } else {
            setModal(true)
        }
    }
    function handleDelete() {
        if (selectedRow.id===''){
            alert('Виберіть клієнта для видалення')
        } else {
            setCustomers(prevCustomers => prevCustomers.filter(employee => employee.id !== selectedRow.id));
        }
    }
    const createCustomer = (newCustomer) => {
        setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
        setModal(false)
    }
    const editCustomer = (newCustomer, id) => {
        newCustomer.id=id
        setCustomers(customers.map(e => {
            if (e.id===id){
                return newCustomer;
            }
            return e
        }));
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
                        <CustomerFormPopup setVisible={setModal} create={createCustomer} edit={editCustomer} selectedRow={selectedRow===undefined ? undefined : customers.find(customer => customer.id === selectedRow.id)}/>
                    </ModalForm>
                </div>
            </div>
            <Table tableData={tableData} rowData={transformData(customers)} setSelectedRow={setSelectedRow}/>
        </div>
    );
};

export default Customers;
