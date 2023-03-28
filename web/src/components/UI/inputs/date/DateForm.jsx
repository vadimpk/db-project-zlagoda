import React from 'react';
import classes from "../date/Date.module.css";

const Date = ({children, ...props}) => {
    return (
        <div className={classes.divForm}>
            <label htmlFor={props.name}> {children}</label>
            <input type="date" {...props} id={props.name} name={props.name} className={classes.dateForm}/>
        </div>
    );
};

export default Date;
