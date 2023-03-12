import React from 'react';
import logoPicture from '../assets/images/logo-big.png'
import AuthorizationForm from "./UI/forms/AuthorizationForm";
import classes from './AuthorizationFormPage.module.css'

const AuthorizationFormPage = () => {
    return (
        <div className={classes.AuthorizationFormPage}>
            <img src={logoPicture} width='496px' height='159px'/>
            <AuthorizationForm/>
        </div>
    );
};

export default AuthorizationFormPage;
