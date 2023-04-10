import React, {useEffect, useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from '../components/UI/SearchBar/Searchbar';
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import PrintButton from "../components/UI/buttons/PrintButton";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from  '../assets/images/edit.svg'
import Modal from "../components/UI/Modal/Modal";
import EmployeePopup from "../components/popups/EmployeePopup";
import Table from "../components/UI/table/Table";
import EmployeeFormPopup from "../components/popups/EmployeeFormPopup";
import ModalForm from "../components/UI/Modal/ModalForm";
import axios from "axios";

const Employees = () => {
    const authToken = localStorage.getItem('authToken');
    const [modal, setModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [isOpenSearch, setOpenSearch] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    let filteredEmployees = employees;
    useEffect(() => {
        axios.get('http://localhost:8082/employee', {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            params: {
                sortAscending: true,
                sortSurname: true
        }
        })
            .then(response => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.log(error);
            });

        if (isChecked) {
            axios.get('http://localhost:8082/employee', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
                params: {
                    sortAscending: true,
                    role: 'Касир',
                    sortSurname: true
                }
            })
                .then(response => {
                    setEmployees(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [isChecked]);
    const tableData = ['ID','Прізвище','Ім\'я','По-батькові','Посада','Зарплата','Початок роботи','Дата народження','Телефон','Місто','Вулиця','Індекс']
    const [employee, setEmployee] = useState({
        id: '',
        surname: '',
        name: '',
        patronymic: '',
        role: '',
        salary: 0,
        date_of_birth: new Date(),
        date_of_start: new Date(),
        phone: '',
        city: '',
        street: '',
        zip: '',
        password: ''
    });
    const [selectedRow, setSelectedRow] = useState({
        id: '',
        surname: '',
        name: '',
        patronymic: '',
        role: '',
        salary: 0,
        date_of_birth: new Date(),
        date_of_start: new Date(),
        phone: '',
        city: '',
        street: '',
        zip: '',
        password: ''
    });

    function handleSearch(surname) {
        //const employee = employees.find( e => e.surname.toLowerCase().includes(surname.toLowerCase()))
        //setEmployee(employee)
        axios.get('http://localhost:8082/employee', {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            params: {
                search: surname
            }
        })
            .then(response => {
                console.log(response.data);
                const employee = response.data
                setEmployee(employee)
                setOpenSearch(true)
            })
            .catch(error => {
                console.log(error);
            });
    }
    const createEmployee = (newEmployee) => {
        axios.post('http://localhost:8082/employee', newEmployee, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });

        setModal(false)
    }
    const editEmployee = (newEmployee, id) => {
        newEmployee.id=id
        axios.put(`http://localhost:8082/employee/${id}`, newEmployee,{
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        setModal(false)
    }
    function handleAdd() {
        setSelectedRow(undefined);
        console.log(new Date())
        setModal(true);
    }
    function handleEdit() {
        if (selectedRow.id===''){
            alert('Виберіть працівника для редагування')
        } else {
            setModal(true)
        }
    }
    function handleDelete() {
        if (selectedRow.id===''){
            alert('Виберіть працівника для видалення')
        } else {
            axios.delete('http://localhost:8082/employee',{
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
                data: {
                    ids: [selectedRow.id]
                }
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                });

        }
    }
    const transformEmployees = filteredEmployees.map(employee => {
        const { password, ...rest } = employee;
        return rest;
    });

    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                <Searchbar onSearch={handleSearch} placeholder={"Пошук працівника"}/>
                    <Modal visible={isOpenSearch} setVisible={setOpenSearch}>
                        <EmployeePopup employee={employee} setVisible={setOpenSearch}/>
                    </Modal>
                <Checkbox
                    name={"cashier"}
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}>Касир</Checkbox>
                </div>
                <div className="filter-left">
                <RoundButton onClick={handleAdd}>+</RoundButton>
                <RoundButton onClick={handleDelete}>&minus;</RoundButton>
                <RoundButton onClick={handleEdit}><img src={edit} width="14px" height="12px"/></RoundButton>
                <PrintButton/>
                </div>
            </div>
            <ModalForm visible={modal} setVisible={setModal}>
                <EmployeeFormPopup setVisible={setModal} create={createEmployee} edit={editEmployee}selectedRow={selectedRow===undefined ? undefined : employees.find(employee => employee.id === selectedRow.id)}/>
            </ModalForm>
            <Table tableData={tableData} rowData={transformEmployees} setSelectedRow={setSelectedRow}/>
        </div>
    );
};

export default Employees;
