import React, { useState } from 'react';
import SearchInput from "../inputs/text-password/SearchInput";
import SearchButton from "../buttons/SearchButton";

function Searchbar(props) {
    const [searchTerm, setSearchTerm] = useState('');

    function handleSearch(event) {
        event.preventDefault();
        props.onSearch(searchTerm);
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
            <SearchButton type="submit">Знайти</SearchButton>
        </form>
    );
}
export default Searchbar;

