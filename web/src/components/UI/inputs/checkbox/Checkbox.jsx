import React from 'react';
import classes from "./Checkbox.module.css"

const Checkbox = ({children, ...props}) => {
    return (
        <div className={classes.div}>
            <input type="checkbox" {...props} id={props.name} name={props.name} className={classes.checkbox}/>
            <label htmlFor={props.name}> {children}</label>
        </div>
    );
};

export default Checkbox;
