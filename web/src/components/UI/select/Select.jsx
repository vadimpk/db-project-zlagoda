import React from 'react';
import classes from "./Select.module.css"

const Select = ({children, ...props}) => {
    return (
        <select {...props} className={classes.select}>
            {children}
        </select>
    );
};

export default Select;
