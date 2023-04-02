import React from 'react';
import RoundButton from "../UI/buttons/RoundButton";

const CheckPopup = ({setVisible, cashier, startDate, endDate, sum}) => {
    const st = {
        color: 'white',
        fontSize: '16px'
    };
    const st2 = {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row'
    };
    const st1 = {
        color: 'white',
        fontSize: '14px',
        fontWeight: 'normal'
    };
    const st3 = {
        color: 'white',
        fontSize: '32px',
        fontWeight: 'bold',
        marginRight: '10px'
    };
    return (
        <div>
                    <div>
                        <div className="profile-top">
                            <div className="profile-name">Загальна сума проданих товарів</div>
                            <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
                        </div>
                        <div className="profile-left" style={st2}>
                            <div className="profile-p">
                                <h3>
                                    Касир
                                </h3>
                                <hr width="116px"/>
                                <p>
                                    {cashier==='Касир' ? cashier : "Не вказано"}
                                </p>
                            </div>
                            <div className="profile-p">
                                <h3>
                                    Період
                                </h3>
                                <hr width="116px"/>
                                { startDate!==undefined&&endDate!==undefined
                                    ?
                                    <p>
                                        З {startDate.toLocaleString()} до {endDate.toLocaleString()}
                                    </p>
                                    :
                                    null
                                }
                            </div>
                        </div>
                        <div className="profile-nl">
                            <p style={st3}>$</p>
                            <div className="profile-nl-content" >
                                <div style={st}>Сума</div>
                                <div style={st1}>{sum} гривень</div>
                            </div>
                        </div>
                    </div>
        </div>
    );
};

export default CheckPopup;
