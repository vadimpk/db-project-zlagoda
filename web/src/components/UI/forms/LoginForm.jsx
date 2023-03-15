import React, {useState} from 'react';
import BigButton from "../buttons/BigButton";
import classes from './LoginForm.module.css'
import BigInput from "../inputs/text-password/BigInput";
import {useNavigate} from "react-router-dom";
import LoginService from "../../../API/LoginService";

const LoginForm = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isManager, setIsManager] = useState(false);


    function validatePhoneNumber(phoneNumber) {
        const regex = /^\+38\d{10}$/;
        return regex.test(phoneNumber);
    }

    const handleLogin = async () => {
        if (validatePhoneNumber(phone) && password) {
            const response = await LoginService.getProfession(phone, password)
            if (response.localeCompare('manager')){
                setIsManager(true)
            }
            navigate('/products');
        } else {
            alert('Будь ласка, введіть номер телефону та пароль. Телефон повинен мати формат: +38XXXXXXXXXX');
        }
    };

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    return (
        <div className={classes.authorizationForm}>
            <BigInput type='text' placeholder='Номер телефону' value={phone} onChange={handlePhoneChange} />
            <BigInput type='password' placeholder='Пароль' value={password} onChange={handlePasswordChange}/>
            <BigButton onClick={handleLogin}>Увійти</BigButton>
        </div>
    );
};

export default LoginForm;
