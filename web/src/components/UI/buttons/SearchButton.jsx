import React from 'react';
import classes from "./SearchButton.module.css";

const SearchButton = ({children,...props}) => {
    return (
            <button {...props} className={classes.button}>
                {children}
            </button>
    );
};

export default SearchButton;
