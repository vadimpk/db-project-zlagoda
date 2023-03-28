import React, {useState} from 'react';
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

const Employees = () => {
    const [modal, setModal] = useState(false);
    //EXAMPLE
    const [employees, setEmployees] = useState([
        {
            ID: '1234567891',
            fullName: {
                surname: 'Горбань',
                name: 'Ольга',
                lastName: 'Олександрівна'
            },
            position: 'Касир',
            salary: '15656',
            startDate: '12.03.2021',
            birthDate: '13.04.2000',
            phone: '+380956324525',
            address: {
                city: 'Кам’янець-Подільський',
                street: 'Марини Цвєтаєвої',
                zipCode: '24300'
            }
        },
        {
            ID: '1234567892',
            fullName: {
                surname: 'Прізвище',
                name: 'Ім\'я',
                lastName: 'По-батькові'
            },
            position: 'Менеджер',
            salary: '15656',
            startDate: '12.03.2021',
            birthDate: '13.04.2000',
            phone: '+380956324525',
            address: {
                city: 'Кам’янець-Подільський',
                street: 'Марини Цвєтаєвої',
                zipCode: '24300'
            }
        },
        {
            ID: '1234567890',
            fullName: {
                surname: 'Прізвище',
                name: 'Ім\'я',
                lastName: 'По-батькові'
            },
            position: 'Касир',
            salary: '15656',
            startDate: '12.03.2021',
            birthDate: '13.04.2000',
            phone: '+380956324525',
            address: {
                city: 'Кам’янець-Подільський',
                street: 'Марини Цвєтаєвої',
                zipCode: '24300'
            }
        }

    ]);
    const tableData = ['ID','ПІБ','Посада','Зарплата','Початок роботи','Дата народження','Телефон','Адреса']
    const [employee, setEmployee] = useState({
        ID: '',
        fullName: {
            surname: '',
            name: '',
            lastName: ''
        },
        position: '',
        salary: '',
        startDate: '',
        birthDate: '',
        phone: '',
        address: {
            city: '',
            street: '',
            zipCode: ''
        }
    });
    const [isOpenSearch, setOpenSearch] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedRow, setSelectedRow] = useState({
        ID: '',
        fullName: '',
        position: '',
        salary: '',
        startDate: '',
        birthDate: '',
        phone: '',
        address: ''
    });
    const filteredEmployees = isChecked ? employees.filter(employee => employee.position==='Касир') : employees

    function handleSearch(surname) {
        //на вхід отримуємо запит із пошуку, виконуємо пошук і задаємо результати у вигляді об'єкта Employee
        console.log(surname)
        const employee = employees.find( e => e.fullName.surname.toLowerCase().includes(surname.toLowerCase()))
        setEmployee(employee)
        setOpenSearch(true)
    }
    function transformData(data) {
        return data.map((item) => {
            const { city, street, zipCode } = item.address;
            const addressString = Object.values(item.address).join(', ');
            const { surname, name, lastName } = item.fullName;
            const fullNameString = [surname, name, lastName].filter(Boolean).join(' ');
            return {
                ...item,
                fullName: fullNameString,
                address: addressString
            };
        });
    }
    const createEmployee = (newEmployee) => {
        setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
        setModal(false)
    }
    const editEmployee = (newEmployee, id) => {
        newEmployee.ID=id
        setEmployees(employees.map(e => {
            if (e.ID===id){
                return newEmployee;
            }
            return e
        }));
        setModal(false)
    }
    function handleAdd() {
        setSelectedRow(undefined);
        setModal(true);
    }
    function handleEdit() {
        if (selectedRow.ID===''){
            alert('Виберіть працівника для редагування')
        } else {
            setModal(true)
        }
    }
    function handleDelete() {
        if (selectedRow.ID===''){
            alert('Виберіть працівника для видалення')
        } else {
            console.log(selectedRow)
            setEmployees(prevEmployees => prevEmployees.filter(employee => employee.ID !== selectedRow.ID));
        }
    }
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
                <EmployeeFormPopup setVisible={setModal} create={createEmployee} edit={editEmployee}selectedRow={selectedRow===undefined ? undefined : employees.find(employee => employee.ID === selectedRow.ID)}/>
            </ModalForm>
            <Table tableData={tableData} rowData={transformData(filteredEmployees)} setSelectedRow={setSelectedRow}/>
        </div>
    );
};

export default Employees;
