import React, {useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";
import Radio from "../UI/inputs/radio/Radio";
import DateForm from "../UI/inputs/date/DateForm";
import employees from "../../pages/Employees";

const EmployeeFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const [employee, setEmployee] = useState(selectedRow ||
        {
        id:  '',
        surname: '',
        name: '',
        patronymic: '',
        role: '',
        salary: 0,
        date_of_birth: '',
        date_of_start: '',
        phone: '',
        city: '',
        street: '',
        zip: '',
        password: ''
    });

    const addNewEmployee = (e) => {
        e.preventDefault()
        if (validateForm()) {
        const dateB = employee.date_of_birth
        employee.date_of_birth=new Date(dateB)
        const dateS = employee.date_of_start
        employee.date_of_start = new Date(dateS)
        const salary = parseFloat(employee.salary)
        employee.salary=salary
        create(employee)

    }
        setEmployee({
            id:  '',
            surname: '',
            name: '',
            patronymic: '',
            role: '',
            salary: 0,
            date_of_birth: '',
            date_of_start: '',
            phone: '',
            city: '',
            street: '',
            zip: '',
            password: ''
        })
        setVisible(false)
    }
    const editEmployee = (e) => {
        e.preventDefault()
        setEmployee({...employee, id: selectedRow.id})
        if (validateForm()) {
            const dateB = employee.date_of_birth
            employee.date_of_birth=new Date(dateB)
            const dateS = employee.date_of_start
            employee.date_of_start = new Date(dateS)
            const salary = parseFloat(employee.salary)
            employee.salary=salary
            edit(employee, selectedRow.id)
        }
        setEmployee({
            id:  '',
            surname: '',
            name: '',
            patronymic: '',
            role: '',
            salary: 0,
            date_of_birth: '',
            date_of_start: '',
            phone: '',
            city: '',
            street: '',
            zip: '',
            password: ''
        })
        setVisible(false)
    }

    const validateForm = () => {
        const errors ={}
            const nameRegExp = /^[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ']{1,50}$/;
            const idRegExp = /^\d{10}$/;
            const phoneRegExp = /^\+380\d{9}$/;
            const salaryRegExp = /^\d+(\.\d+)?$/;
            const zipRegExp = /^\d{5}$/;
            const addressRegExp = /^[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ0-9'.,\s-]{1,50}$/;
        const now = new Date();
        const birthDate = new Date(employee.date_of_birth);
        let age = now.getFullYear() - birthDate.getFullYear();
        const monthDiff = now.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
            age--;
        }

            if (!nameRegExp.test(employee.name)) {
                errors.name="Ім'я має містити від 1 до 50 букв українського алфавіту";
            }

            if (!nameRegExp.test(employee.surname)) {
                errors.surname="Прізвище має містити від 1 до 50 букв українського алфавіту";
            }

            if (!nameRegExp.test(employee.patronymic)) {
                errors.patronymic="По-батькові має містити від 1 до 50 букв українського алфавіту";
            }

            /*if (!idRegExp.test(employee.id)) {
                errors.id="id має містити 10 цифр";
            }*/

            if (!salaryRegExp.test(employee.salary)) {
                errors.salary="Зарплата має бути числом";
            }

            if (!phoneRegExp.test(employee.phone)) {
                errors.phone="Телефон має мати довжину 13 символів, починатись з +380 і містити лише цифри";
            }

            if (!addressRegExp.test(employee.city)) {
                errors.city="Місто має містити від 1 до 50 букв, цифр та знаків пунктуації";
            }

            if (!addressRegExp.test(employee.street)) {
                errors.street="Вулиця має містити від 1 до 50 букв, цифр та знаків пунктуації";
            }

            if (!zipRegExp.test(employee.zip)) {
                errors.zip="Індекс має містити 5 цифр (або 9, якщо використовується формат XXXXX-XXXX)";
            }

            if (!employee.date_of_start) {
                errors.date_of_start="Вкажіть дату початку роботи";
            }

            if (!employee.password) {
                errors.password="Вкажіть пароль";
            }

            if (age < 18) {
                errors.date_of_birth="Вік працівника повинен бути не менше 18 років";
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
                                    value={employee.name}
                                    onChange={e => setEmployee({...employee,name: e.target.value})}>Ім'я</InputTextForm>
                                <InputTextForm
                                    name={"surname"}
                                    placeholder={"Прізвище"}
                                    value={employee.surname}
                                    onChange={e => setEmployee({...employee, surname: e.target.value})}>Прізвище</InputTextForm>
                                <InputTextForm
                                    name={"secondName"}
                                    placeholder={"По-батькові"}
                                    value={employee.patronymic}
                                    onChange={e => setEmployee({...employee,patronymic: e.target.value})}>По-батькові</InputTextForm>
                            </div>
                            <div className="form-content">
                                <InputTextForm
                                    name={"id"}
                                    placeholder={"id"}
                                    value={ selectedRow===undefined ? employee.id : selectedRow.id}
                                    onChange={e => setEmployee({...employee, id: e.target.value})}>id</InputTextForm>
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
                                onChange={() => setEmployee({...employee, role: 'Касир'})}>Касир</Radio>
                            <Radio
                                name={"position"}
                                id={"manager"}
                                onChange={() => setEmployee({ ...employee, role: 'Менеджер' })}>Менеджер</Radio>
                        </div>
                        <div className="form-main">
                            <div className="form-content">
                                <InputTextForm
                                    name={"city"}
                                    placeholder={"Місто"}
                                    value={employee.city}
                                    onChange={e => setEmployee({...employee, city: e.target.value })}>Місто</InputTextForm>
                                <InputTextForm
                                    name={"street"}
                                    placeholder={"Вулиця"}
                                    value={employee.street}
                                    onChange={e => setEmployee({...employee, street: e.target.value})}>Вулиця</InputTextForm>
                                <InputTextForm
                                    name={"index"}
                                    value={employee.zip}
                                    onChange={e => setEmployee({...employee, zip: e.target.value})}>Індекс</InputTextForm>
                            </div>
                            <div className="form-content">
                                <DateForm
                                    name={"startWork"}
                                    value={employee.date_of_start}
                                    onChange={e => setEmployee({...employee, date_of_start: e.target.value})}>Дата початку роботи</DateForm>
                                <DateForm
                                    name={"birth"}
                                    value={employee.date_of_birth}
                                    onChange={e => setEmployee({...employee, date_of_birth: e.target.value})}>
                                    Дата народження
                                </DateForm>
                                <InputTextForm
                                    name={"street"}
                                    placeholder={"Пароль"}
                                    value={employee.password}
                                    onChange={e => setEmployee({...employee, password: e.target.value})}>Пароль</InputTextForm>
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
