import React from 'react';
import logoPicture from '../assets/images/logo-big.png'
import LoginForm from "../components/UI/forms/LoginForm";

const Login = () => {
    return (
        <div className="login">
            <img src={logoPicture} width='496px' height='159px'/>
            <LoginForm/>
        </div>
    );
};

export default Login;
