import React from 'react';
import classes from "./PrintButton.module.css"

const PrintButton = ({props}) => {
    return (
        <button className={classes.printb}>
            Друк
        </button>
    );
};

export default PrintButton;
