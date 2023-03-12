import React from 'react';
import classes from './BigButton.module.css'
const BigButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.button}>
            {children}
        </button>
    );
};

export default BigButton;
