import React, {useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";
import Radio from "../UI/inputs/radio/Radio";
import DateForm from "../UI/inputs/date/DateForm";

const EmployeeFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const [employee, setEmployee] = useState(selectedRow ||
        {
        ID:  '',
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

    const addNewEmployee = (e) => {
        e.preventDefault()
        if (validateForm()) {
        create(employee)
    }
        setEmployee({
            ID: '',
            fullName: {
                name: '',
                surname: '',
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
            }})
        setVisible(false)
    }
    const editEmployee = (e) => {
        e.preventDefault()
        setEmployee({...employee, ID: selectedRow.ID})
        console.log(selectedRow.ID)
        if (validateForm()) {
            edit(employee, selectedRow.ID)
        }
        setEmployee({
            ID: '',
            fullName: {
                name: '',
                surname: '',
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
            }})
        setVisible(false)
    }

    const validateForm = () => {
        const nameRegex = /^[іїа-яА-Я]+$/;
        const phoneRegex = /^\+380\d{9}$/;
        const zipCodeRegex = /^\d{5}$/;
        const errors = {};

        if (!employee.fullName.surname || !nameRegex.test(employee.fullName.surname.trim())) {
            errors.surname = 'Некоректне прізвище';
        }
        if (!employee.fullName.name || !nameRegex.test(employee.fullName.name.trim())) {
            errors.name = 'Некоректне ім\'я';
        }
        if ((!employee.ID)&&selectedRow===undefined) {
            errors.ID = 'Некоректний ID';
        }
        if (!employee.salary || isNaN(employee.salary)) {
            errors.salary = 'Некоректна зарплата';
        }
        if (!employee.phone || !phoneRegex.test(employee.phone)) {
            errors.phone = 'Некоректний номер телефону';
        }
        if (!employee.address.city || !nameRegex.test(employee.address.city.trim())) {
            errors.city = 'Некоректне місто';
        }
        if (!employee.address.street || !nameRegex.test(employee.address.street.trim())) {
            errors.street = 'Некоректна вулиця';
        }
        if (!employee.address.zipCode || !zipCodeRegex.test(employee.address.zipCode)) {
            errors.zipCode = 'Некоректний індекс';
        }
        if (!employee.startDate) {
            errors.startDate = 'Вкажіть дату початку роботи';
        }
        if (!employee.birthDate) {
            errors.birthDate = 'Вкажіть дату народження';
        }

        if (Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors).join('\n');
            alert(errorMessages);
            return false;
        }
        return true;
    }

        return (
        <form>
            <div className="form-top">
                {selectedRow===undefined
                ?
                    <h3>Додати працівника</h3>
                :
                <h3>Редагувати працівника</h3>
                }

                <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
                    </div>
                        <div className="form-main">
                            <div className="form-content">
                                <InputTextForm
                                    name={"name"}
                                    placeholder={"Ім'я"}
                                    value={employee.fullName.name}
                                    onChange={e => setEmployee({
                                        ...employee,
                                        fullName: {
                                            ...employee.fullName,
                                            name: e.target.value
                                        }
                                    })}>Ім'я</InputTextForm>
                                <InputTextForm
                                    name={"surname"}
                                    placeholder={"Прізвище"}
                                    value={employee.fullName.surname}
                                    onChange={e => setEmployee({
                                        ...employee,
                                        fullName: {
                                            ...employee.fullName,
                                            surname: e.target.value
                                        }
                                    })}>Прізвище</InputTextForm>
                                <InputTextForm
                                    name={"secondName"}
                                    placeholder={"По-батькові"}
                                    value={employee.fullName.lastName}
                                    onChange={e => setEmployee({
                                        ...employee,
                                        fullName: {
                                            ...employee.fullName,
                                            lastName: e.target.value
                                        }
                                    })}>По-батькові</InputTextForm>
                            </div>
                            <div className="form-content">
                                <InputTextForm
                                    name={"id"}
                                    placeholder={"ID"}
                                    value={ selectedRow===undefined ? employee.ID : selectedRow.ID}
                                    onChange={e => setEmployee({...employee, ID: e.target.value})}>ID</InputTextForm>
                                <InputTextForm
                                    name={"salary"}
                                    placeholder={"Зарплата"}
                                    value={employee.salary}
                                    onChange={e => setEmployee({...employee, salary: e.target.value})}>Зарплата</InputTextForm>
                                <InputTextForm
                                    name={"phone"}
                                    placeholder={"+380XXXXXXXXX"}
                                    value={employee.phone}
                                    onChange={e => setEmployee({...employee, phone: e.target.value})}>Телефон</InputTextForm>
                            </div>
                        </div>
                        <div className="form-width">
                            Посада
                            <Radio
                                name={"position"}
                                id={"cashier"}
                                onClick={() => setEmployee({...employee, position: 'Касир'})}>Касир</Radio>
                            <Radio
                                name={"position"}
                                id={"manager"}
                                onClick={() => setEmployee({...employee, position: 'Менеджер'})}>Менеджер</Radio>
                        </div>
                        <div className="form-main">
                            <div className="form-content">
                                <InputTextForm
                                    name={"city"}
                                    placeholder={"Місто"}
                                    value={employee.address.city}
                                    onChange={e => setEmployee({
                                        ...employee,
                                        address: {
                                            ...employee.address,
                                            city: e.target.value
                                        }
                                    })}>Місто</InputTextForm>
                                <InputTextForm
                                    name={"street"}
                                    placeholder={"Вулиця"}
                                    value={employee.address.street}
                                    onChange={e => setEmployee({
                                        ...employee,
                                        address: {
                                            ...employee.address,
                                            street: e.target.value
                                        }
                                    })}>Вулиця</InputTextForm>
                                <InputTextForm
                                    name={"index"}
                                    value={employee.address.zipCode}
                                    onChange={e => setEmployee({
                                        ...employee,
                                        address: {
                                            ...employee.address,
                                            zipCode: e.target.value
                                        }
                                    })}>Індекс</InputTextForm>
                            </div>
                            <div className="form-content">
                                <DateForm
                                    name={"startWork"}
                                    value={employee.startDate}
                                    onChange={e => setEmployee({...employee, startDate: e.target.value})}>Дата початку роботи</DateForm>
                                <DateForm
                                    name={"birth"}
                                    value={employee.birthDate}
                                    onChange={e => setEmployee({...employee, birthDate: e.target.value})}>Дата народження</DateForm>
                            </div>
                        </div>
            {selectedRow===undefined
            ?
                <BigButton onClick={addNewEmployee}>Додати</BigButton>
                :
                <BigButton onClick={editEmployee}>Зберегти</BigButton>
            }
        </form>
    );
};

export default EmployeeFormPopup;
