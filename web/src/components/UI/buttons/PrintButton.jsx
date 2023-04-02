import React from 'react';
import classes from "./PrintButton.module.css"

const PrintButton = ({label, ...props}) => {
    return (
        <button {...props} className={classes.printb}>
            {
                label!==undefined
                ?
                    label
                    :
                    "Друк"
            }
        </button>
    );
};

export default PrintButton;
