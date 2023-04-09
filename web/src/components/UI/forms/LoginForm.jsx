import React, {useContext, useState} from 'react';
import BigButton from "../buttons/BigButton";
import classes from './LoginForm.module.css'
import BigInput from "../inputs/text-password/BigInput";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {ManagerContext} from "../../../context";

const LoginForm = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [employee, setEmployee] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    const handleLogin = async () => {
            const requestBody = {
                employeeId: id,
                password: password
            };
            axios.post('http://localhost:8082/employee/login', requestBody)
                .then(response => {
                    const { employee, authToken } = response.data;
                    setEmployee(employee);
                    setAuthToken(authToken);
                    if(employee.role==='Касир'){
                        setIsManager(false);
                    }else {
                        setIsManager(true);
                    }
                    navigate('/products');
                    localStorage.setItem('authToken', authToken);
                    localStorage.setItem('employee', employee);
                    console.log(employee)
                    console.log(authToken)
                })
                .catch(error => {
                    console.error(error);
                });
    };


    const handlePhoneChange = (event) => {
        setId(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    return (
        <div className={classes.authorizationForm}>
            <BigInput type='text' placeholder='ID' value={id} onChange={handlePhoneChange} />
            <BigInput type='password' placeholder='Пароль' value={password} onChange={handlePasswordChange}/>
            <BigButton onClick={handleLogin}>Увійти</BigButton>
        </div>
    );
};

export default LoginForm;
