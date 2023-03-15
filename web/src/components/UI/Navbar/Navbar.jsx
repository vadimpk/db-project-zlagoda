import React, {useContext} from 'react';
import {ManagerContext} from "../../../context";
import logoPicture from '../../../assets/images/logo-small.png'

const Navbar = () => {
    const {isManager, setIsManager} = useContext(ManagerContext);

    const logout = () => {
        setIsManager(false);
        localStorage.removeItem('manager')
    }

    return (
        <nav className="navigation-menu">
            <div className="logo">
                <img src={logoPicture} width="150px" height="24px"/>
            </div>
            <ul className="menu-list">
                <li><a href="#">Працівники</a></li>
                <li><a href="#">Постійні клієнти</a></li>
                <li><a href="#">Чеки</a></li>
                <li className="has-dropdown">
                    <a href="#">Товари</a>
                    <ul className="dropdown-menu">
                        <li><a href="#">Товари/Категорії</a></li>
                        <li><a href="#">Товари в магазині</a></li>
                    </ul>
                </li>
            </ul>
        </nav>

    );
};

export default Navbar;
