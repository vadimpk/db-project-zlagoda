import React, {useState} from 'react';
import logoPicture from '../../../assets/images/logo-small.png'
import profile from '../../../assets/images/profile.png'
import ProfilePopup from "../../popups/ProfilePopup";
import Modal from "../Modal/Modal";

const Navbar = () => {
    const employee = JSON.parse(localStorage.getItem('employee'));
    const isManager = employee.role!=='Касир';
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
                    <ul className="dropdown-menu">
                        <li><a href="/categories">Товари/Категорії</a></li>
                        <li><a href="/products">Товари в магазині</a></li>
                    </ul>

                </li>
                {isManager
                    ?
                    <li><a href="/statistics">Статистика</a></li>
                    :
                    null
                }
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
