import React, {useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";

const CustomerFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const [customer, setCustomer] = useState(selectedRow ||
        {
            cardNo:  '',
            fullName: {
                surname: '',
                name: '',
                lastName: ''
            },
            percent: '',
            phone: '',
            address: {
                city: '',
                street: '',
                zipCode: ''
            }
        });

    const addNewCustomer = (e) => {
        e.preventDefault()
        console.log(customer)
        if (validateForm()) {
            create(customer)
        }
        setCustomer({
            cardNo: '',
            fullName: {
                name: '',
                surname: '',
                lastName: ''
            },
            percent: '',
            phone: '',
            address: {
                city: '',
                street: '',
                zipCode: ''
            }})
        setVisible(false)
    }
    const editCustomer = (e) => {
        e.preventDefault()
        setCustomer({...customer, cardNo: selectedRow.cardNo})
        console.log(customer)
        if (validateForm()) {
            edit(customer, selectedRow.cardNo)
        }
        setCustomer({
            cardNo: '',
            fullName: {
                name: '',
                surname: '',
                lastName: ''
            },
            percent: '',
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

        if (!customer.fullName.surname || !nameRegex.test(customer.fullName.surname.trim())) {
            errors.surname = 'Некоректне прізвище';
        }
        if (!customer.fullName.name || !nameRegex.test(customer.fullName.name.trim())) {
            errors.name = 'Некоректне ім\'я';
        }
        if ((!customer.cardNo)&&selectedRow===undefined) {
            errors.cardNo = 'Некоректний номер карти';
        }
        if (!customer.percent || isNaN(customer.percent)) {
            errors.percent = 'Некоректний відсоток';
        }
        if (!customer.phone || !phoneRegex.test(customer.phone)) {
            errors.phone = 'Некоректний номер телефону';
        }
        if (!customer.address.city || !nameRegex.test(customer.address.city.trim())) {
            errors.city = 'Некоректне місто';
        }
        if (!customer.address.street || !nameRegex.test(customer.address.street.trim())) {
            errors.street = 'Некоректна вулиця';
        }
        if (!customer.address.zipCode || !zipCodeRegex.test(customer.address.zipCode)) {
            errors.zipCode = 'Некоректний індекс';
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
                        value={customer.fullName.name}
                        onChange={e => setCustomer({
                            ...customer,
                            fullName: {
                                ...customer.fullName,
                                name: e.target.value
                            }
                        })}>Ім'я</InputTextForm>
                    <InputTextForm
                        name={"surname"}
                        placeholder={"Прізвище"}
                        value={customer.fullName.surname}
                        onChange={e => setCustomer({
                            ...customer,
                            fullName: {
                                ...customer.fullName,
                                surname: e.target.value
                            }
                        })}>Прізвище</InputTextForm>
                    <InputTextForm
                        name={"secondName"}
                        placeholder={"По-батькові"}
                        value={customer.fullName.lastName}
                        onChange={e => setCustomer({
                            ...customer,
                            fullName: {
                                ...customer.fullName,
                                lastName: e.target.value
                            }
                        })}>По-батькові</InputTextForm>
                </div>
                <div className="form-content">
                    <InputTextForm
                        name={"cardNo"}
                        placeholder={"Номер карти"}
                        value={ selectedRow===undefined ? customer.cardNo : selectedRow.cardNo}
                        onChange={e => setCustomer({...customer, cardNo: e.target.value})}>Номер карти</InputTextForm>
                    <InputTextForm
                        name={"percent"}
                        placeholder={"Відсоток"}
                        value={customer.percent}
                        onChange={e => setCustomer({...customer, percent: e.target.value})}>Відсоток</InputTextForm>
                    <InputTextForm
                        name={"phone"}
                        placeholder={"+380XXXXXXXXX"}
                        value={customer.phone}
                        onChange={e => setCustomer({...customer, phone: e.target.value})}>Телефон</InputTextForm>
                </div>
            </div>
            <div className="form-main">
                <div className="form-content">
                    <InputTextForm
                        name={"city"}
                        placeholder={"Місто"}
                        value={customer.address.city}
                        onChange={e => setCustomer({
                            ...customer,
                            address: {
                                ...customer.address,
                                city: e.target.value
                            }
                        })}>Місто</InputTextForm>
                    <InputTextForm
                        name={"street"}
                        placeholder={"Вулиця"}
                        value={customer.address.street}
                        onChange={e => setCustomer({
                            ...customer,
                            address: {
                                ...customer.address,
                                street: e.target.value
                            }
                        })}>Вулиця</InputTextForm>
                    <InputTextForm
                        name={"index"}
                        value={customer.address.zipCode}
                        onChange={e => setCustomer({
                            ...customer,
                            address: {
                                ...customer.address,
                                zipCode: e.target.value
                            }
                        })}>Індекс</InputTextForm>
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
