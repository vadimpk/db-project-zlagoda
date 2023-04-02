import React from 'react';
import classes from "./BigInput.module.css";

const BigInput = ({...props}) => {
    return (
        <input {...props} className={classes.bigInput}/>
    );
};

export default BigInput;
