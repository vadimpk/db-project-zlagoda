import React, {useEffect, useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";
import axios from "axios";

const CustomerFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const [customer, setCustomer] = useState({
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

    useEffect(() => {
        if (selectedRow!==undefined) {
            setCustomer(selectedRow)
        }
    },[selectedRow]);

    const addNewCustomer = (e) => {
        e.preventDefault()
        if (validateForm()) {
            const discount = parseFloat(customer.discount)
            customer.discount=discount
            create(customer)
        }
        setCustomer({
            id: '',
            name: '',
            surname:'',
            patronymic:'',
            discount: 0,
            phone_number: '',
            city: '',
            street: '',
            zip_code: ''
        })
        setVisible(false)
    }
    const editCustomer = (e) => {
        e.preventDefault()
        setCustomer({...customer, id: selectedRow})
        console.log(customer)
        if (validateForm()) {
            const discount = parseFloat(customer.discount)
            customer.discount=discount
            edit(customer, selectedRow.id)
        }
        setCustomer({
            id: '',
            name: '',
            surname:'',
            patronymic:'',
            discount: 0,
            phone_number: '',
            city: '',
            street: '',
            zip_code: ''
        })
        setVisible(false)
    }
    const validateForm = () => {
        const nameRegExp = /^[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ']{1,50}$/;
        const phone_numberRegExp = /^\+380\d{9}$/;
        const zipRegExp = /^\d{5}(\d{4})?$/;
        const discountRegExp = /^[1-9]\d*$/;
        const addressRegExp = /^[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ0-9'.,\s-]{1,50}$/;
        const errors = {};

        if (!nameRegExp.test(customer.name)) {
            errors.name="Ім'я має містити від 1 до 50 букв українського алфавіту";
        }

        if (!nameRegExp.test(customer.surname)) {
            errors.surname="Прізвище має містити від 1 до 50 букв українського алфавіту";
        }

        if (!nameRegExp.test(customer.patronymic)) {
            errors.patronymic="По-батькові має містити від 1 до 50 букв українського алфавіту";
        }
        if (!discountRegExp.test(customer.discount)) {
            errors.discount="Відсоток має бути цілим числом";
        }
        if (!phone_numberRegExp.test(customer.phone_number)) {
            errors.phone_number="Телефон має мати довжину 13 символів, починатись з +380 і містити лише цифри";
        }

        if (!addressRegExp.test(customer.city)) {
            errors.city="Місто має містити від 1 до 50 букв, цифр та знаків пунктуації";
        }

        if (!addressRegExp.test(customer.street)) {
            errors.street="Вулиця має містити від 1 до 50 букв, цифр та знаків пунктуації";
        }

        if (!zipRegExp.test(customer.zip_code)) {
            errors.zip_code="Індекс має містити 5 цифр (або 9, якщо використовується формат XXXXXXXXX)";
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
                    <h3>Додати постійного клієнта</h3>
                    :
                    <h3>Редагувати постійного клієнта</h3>
                }

                <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
            </div>
            <div className="form-main">
                <div className="form-content">
                    <InputTextForm
                        name={"name"}
                        placeholder={"Ім'я"}
                        value={customer.name}
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}>Ім'я</InputTextForm>
                    <InputTextForm
                        name={"surname"}
                        placeholder={"Прізвище"}
                        value={customer.surname}
                        onChange={e => setCustomer({ ...customer, surname: e.target.value })}>Прізвище</InputTextForm>
                    <InputTextForm
                        name={"secondName"}
                        placeholder={"По-батькові"}
                        value={customer.patronymic}
                        onChange={e => setCustomer({...customer, patronymic: e.target.value })}>По-батькові</InputTextForm>
                </div>
                <div className="form-content">
                    <InputTextForm
                        name={"percent"}
                        placeholder={"Відсоток"}
                        value={`${customer.discount}`}
                        onChange={e => setCustomer({...customer, discount: e.target.value})}>Відсоток</InputTextForm>
                    <InputTextForm
                        name={"phone_number"}
                        placeholder={"+380XXXXXXXXX"}
                        value={customer.phone_number}
                        onChange={e => setCustomer({...customer, phone_number: e.target.value})}>Телефон</InputTextForm>
                </div>
            </div>
            <div className="form-main">
                <div className="form-content">
                    <InputTextForm
                        name={"city"}
                        placeholder={"Місто"}
                        value={customer.city}
                        onChange={e => setCustomer({...customer,city: e.target.value })}>Місто</InputTextForm>
                    <InputTextForm
                        name={"street"}
                        placeholder={"Вулиця"}
                        value={customer.street}
                        onChange={e => setCustomer({...customer, street: e.target.value })}>Вулиця</InputTextForm>
                    <InputTextForm
                        name={"index"}
                        value={customer.zip_code}
                        onChange={e => setCustomer({...customer, zip_code: e.target.value })}>Індекс</InputTextForm>
                </div>
            </div>
            {selectedRow===undefined
                ?
                <BigButton onClick={addNewCustomer}>Додати</BigButton>
                :
                <BigButton onClick={editCustomer}>Зберегти</BigButton>
            }
        </form>
    );
};

export default CustomerFormPopup;
