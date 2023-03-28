import React from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import phone from '../../assets/images/phone.png'
import location from '../../assets/images/address.png'

const ProfilePopup = ({setVisible}) => {
    const st = {
        color: 'white',
        fontSize: '16px'
    };
    const st1 = {
        color: 'white',
        fontSize: '14px',
        fontWeight: 'normal'
    };
    const st2 = {
        marginBottom: '10px'
    };
    return (
        <div>
            <div className="profile-top">
            <div className="profile-name">Прізвище Ім'я По-батькові</div>
            <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
            </div>
            <div className="profile-left">
            <div className="profile-p">
                <h3>
                    Зарплата
                </h3>
                <hr width="116px"/>
                <p>
                    123123 гривень
                </p>
            </div>
            <div className="profile-p">
                <h3>
                    Дата народження
                </h3>
                <hr width="116px"/>
                <p>
                    12.03.1999
                </p>
            </div>
            <div className="profile-p">
                <h3>
                    Дата початку роботи
                </h3>
                <hr width="116px"/>
                <p>
                    13.05.2019
                </p>
            </div>
            </div>
            <div className="profile-nl" style={st2}>
                <img src={phone} height="25px" width="25px" className="profile-v"/>
                <div className="profile-nl-content" >
                    <div style={st}>Телефон</div>
                    <div style={st1}>+380684951236</div>
                </div>
            </div>
            <div className="profile-nl">
                <img src={location} width="18px" height="25px" className="profile-v"/>
                <div className="profile-nl-content">
                    <div style={st}>Адреса</div>
                    <div style={st1}>Київ, вул. Марини Цвєтаєвої, 24300</div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePopup;
