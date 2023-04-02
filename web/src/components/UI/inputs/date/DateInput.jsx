import React from 'react';
import classes from "../date/Date.module.css";

const DateInput = ({children, ...props}) => {
    return (
        <div className={classes.div}>
            <label htmlFor={props.name}> {children}</label>
            <input type="date" {...props} id={props.name} name={props.name} className={classes.date}/>
        </div>
    );
};

export default DateInput;
