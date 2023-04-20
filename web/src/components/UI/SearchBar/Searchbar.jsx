import React, { useState } from 'react';
import SearchInput from "../inputs/text-password/SearchInput";
import SearchButton from "../buttons/SearchButton";

function Searchbar({label, ...props}) {
    const [searchTerm, setSearchTerm] = useState('');

    function handleSearch(event) {
        event.preventDefault();
        props.onSearch(searchTerm);
        setSearchTerm('')
    }

    function handleInputChange(event) {
        setSearchTerm(event.target.value);
    }

    return (
        <form onSubmit={handleSearch} className="searchBar">
            <SearchInput
                placeholder={props.placeholder}
                value={searchTerm}
                onChange={handleInputChange}
            />
            <SearchButton type="submit">{
                label!==undefined
                    ?
                    label
                    :
                    "Знайти"
            }</SearchButton>
        </form>
    );
}
export default Searchbar;

