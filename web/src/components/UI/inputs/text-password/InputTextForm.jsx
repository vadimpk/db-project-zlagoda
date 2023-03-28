import React from 'react';
import classes from "../text-password/BigInput.module.css";

const InputTextForm = ({children, ...props}) => {
    return (
        <div className={classes.div}>
            <label htmlFor={props.name}> {children}</label>
            <input type="text" {...props} id={props.name} name={props.name} placeholder={props.placeholder}/>
        </div>
    );
};

export default InputTextForm;
