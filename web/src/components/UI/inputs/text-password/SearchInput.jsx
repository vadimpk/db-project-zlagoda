import React from 'react';
import classes from "./SeacrhInput.module.css";
import search from '../../../../assets/images/search.png'

const SearchInput = ({...props}) => {
    return (
        <div className={classes.search}>
            <img src={search} width="15px" height="15px" className={classes.searchIcon}/>
            <input {...props} type="text" className={classes.searchInput}/>
        </div>
    );
};

export default SearchInput;
