import React from 'react';
import classes from "./Modal.module.css";
const ModalForm = ({children, visible, setVisible}) => {

    const rootClasses = [classes.myModal]
    if(visible){
        rootClasses.push(classes.active)
    }

    return (
        <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
            <div className={classes.myModalFormContent}
                 onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default ModalForm;
