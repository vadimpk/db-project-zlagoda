import React from 'react';
import BigButton from "../buttons/BigButton";
import classes from './AuthorizationForm.module.css'
import BigInput from "../inputs/text-password/BigInput";

const AuthorizationForm = () => {
    return (
        <div className={classes.authorizationForm}>
            <BigInput type='text' placeholder='Електронна адреса або номер телефону'/>
            <BigInput type='password' placeholder='Пароль'/>
            <BigButton>Увійти</BigButton>
        </div>
    );
};

export default AuthorizationForm;
