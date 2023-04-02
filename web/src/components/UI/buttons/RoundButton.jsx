import React from 'react';
import classes from "./RoundButton.module.css";

const RoundButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.button}>
            {children}
        </button>
    );
};

export default RoundButton;
