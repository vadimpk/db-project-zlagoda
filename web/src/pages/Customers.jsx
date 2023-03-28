import React, {useContext, useState} from 'react';
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

const Customers = () => {
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [modal, setModal] = useState(false);
    const tableData = ['Номер карти','ПІБ','Відсоток','Телефон','Адреса']
    const [selectedRow, setSelectedRow] = useState({
        cardNo: '',
        fullName: '',
        percent: '',
        phone: '',
        address: ''
    });
    //EXAMPLE
    const [customers, setCustomers] = useState([
        {
            cardNo: '1234567891',
            fullName: {
                surname: 'Горбань',
                name: 'Ольга',
                lastName: 'Олександрівна'
            },
            percent: '0',
            phone: '+380956324525',
            address: {
                city: 'Кам’янець-Подільський',
                street: 'Марини Цвєтаєвої',
                zipCode: '24300'
            }
        },
        {
            cardNo: '1234567892',
            fullName: {
                surname: 'Прізвище',
                name: 'Ім\'я',
                lastName: 'По-батькові'
            },
            percent: '2',
            phone: '+380956324525',
            address: {
                city: 'Кам’янець-Подільський',
                street: 'Марини Цвєтаєвої',
                zipCode: '24300'
            }
        },
        {
            cardNo: '1234567890',
            fullName: {
                surname: 'Прізвище',
                name: 'Ім\'я',
                lastName: 'По-батькові'
            },
            percent: '8',
            phone: '+380956324525',
            address: {
                city: 'Кам’янець-Подільський',
                street: 'Марини Цвєтаєвої',
                zipCode: '24300'
            }
        }

    ]);
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

    function handleSearch(percent) {
        setCustomers(customers.filter( c => c.percent===percent))
    }
    function handleAdd() {
        setSelectedRow(undefined);
        setModal(true);
    }
    function handleEdit() {
        if (selectedRow.cardNo===''){
            alert('Виберіть клієнта для редагування')
        } else {
            setModal(true)
        }
    }
    function handleDelete() {
        if (selectedRow.cardNo===''){
            alert('Виберіть клієнта для видалення')
        } else {
            setCustomers(prevCustomers => prevCustomers.filter(employee => employee.cardNo !== selectedRow.cardNo));
        }
    }
    const createCustomer = (newCustomer) => {
        setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
        setModal(false)
    }
    const editCustomer = (newCustomer, cardNo) => {
        newCustomer.cardNo=cardNo
        setCustomers(customers.map(e => {
            if (e.cardNo===cardNo){
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
                        <CustomerFormPopup setVisible={setModal} create={createCustomer} edit={editCustomer} selectedRow={selectedRow===undefined ? undefined : customers.find(customer => customer.cardNo === selectedRow.cardNo)}/>
                    </ModalForm>
                </div>
            </div>
            <Table tableData={tableData} rowData={transformData(customers)} setSelectedRow={setSelectedRow}/>
        </div>
    );
};

export default Customers;
