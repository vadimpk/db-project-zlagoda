import React, {useContext, useState} from 'react';
import {ManagerContext} from "../../../context";
import logoPicture from '../../../assets/images/logo-small.png'
import profile from '../../../assets/images/profile.png'
import ProfilePopup from "../../ProfilePopup";
import Modal from "../Modal/Modal";

const Navbar = () => {
    const {isManager, setIsManager} = useContext(ManagerContext);
    const [modal, setModal] = useState(false);

    return (
        <nav className="navigation-menu">
            <div className="nav-left">
            <div className="logo">
                <img src={logoPicture} width="150px" height="24px"/>
            </div>
            <ul className="menu-list">
                {isManager
                    ?
                    <li><a href="/employees">Працівники</a></li>
                    :
                    null
                }
                <li><a href="/customers">Постійні клієнти</a></li>
                <li><a href="/checks">Чеки</a></li>
                <li className="has-dropdown">
                    <a href="/products">Товари</a>
                    {isManager
                        ?
                        <ul className="dropdown-menu">
                            <li><a href="/categories">Товари/Категорії</a></li>
                            <li><a href="/products">Товари в магазині</a></li>
                        </ul>
                        :
                        null
                    }

                </li>
            </ul>
            </div>
            {!isManager
                ?
                <div>
                <button id="popup-btn" onClick={() => setModal(true)}>
                    <img src={profile} alt="Profile"/>
                </button>
                <Modal visible={modal} setVisible={setModal}>
                    <ProfilePopup setVisible={setModal}/>
                </Modal>
                </div>
            :
            null}
        </nav>

    );
};

export default Navbar;
