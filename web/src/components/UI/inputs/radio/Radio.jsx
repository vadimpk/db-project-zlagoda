import React from 'react';
import classes from "../radio/Radio.module.css";

const Radio = ({children, ...props}) => {
    return (
        <div className={classes.div}>
            <input type="radio" {...props} id={props.name} name={props.name} className={classes.radio} value={props.value}/>
            <label htmlFor={props.name}> {children}</label>
        </div>
    );
};

export default Radio;
