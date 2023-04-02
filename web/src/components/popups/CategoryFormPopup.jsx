import React, {useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";

const CategoryFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const [category, setCategory] = useState(selectedRow ||
        {
            catNo:  '',
            name: ''
        });

    const addNewCategory = (e) => {
        e.preventDefault()
        if (validateForm()) {
            create(category)
        }
        setCategory({
            catNo:  '',
            name: ''
            })
        setVisible(false)
    }
    const editCategory = (e) => {
        e.preventDefault()
        setCategory({...category, catNo: selectedRow.catNo})
        if (validateForm()) {
            edit(category, selectedRow.catNo)
        }
        setCategory({
            catNo:  '',
            name: ''
            })
        setVisible(false)
    }
    const validateForm = () => {
        const nameRegex = /^[іїа-яА-Я]+$/;
        const errors = {};

        if (!category.name || !nameRegex.test(category.name.trim())) {
            errors.name = 'Некоректна назва категорії';
        }
        if ((!category.catNo)&&selectedRow===undefined) {
            errors.cardNo = 'Некоректний номер категорії';
        }

        if (Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors).join('\n');
            alert(errorMessages);
            return false;
        }
        return true;
    }

    return (
        <form>
            <div className="form-top">
                {selectedRow===undefined
                    ?
                    <h3>Додати категорію</h3>
                    :
                    <h3>Редагувати категорію</h3>
                }

                <RoundButton onClick={() => setVisible(false)}>&times;</RoundButton>
            </div>
            <div className="form-main">
                <div className="form-content">
                    <InputTextForm
                        name={"catNo"}
                        placeholder={"Номер категорії"}
                        value={ selectedRow===undefined ? category.catNo : selectedRow.catNo}
                        onChange={e => setCategory({...category, catNo: e.target.value})}>Номер категорії</InputTextForm>
                    <InputTextForm
                        name={"name"}
                        placeholder={"Назва категорії"}
                        value={category.name}
                        onChange={e => setCategory({...category, name: e.target.value})}>Назва категорії</InputTextForm>
                </div>
            </div>
            {selectedRow===undefined
                ?
                <BigButton onClick={addNewCategory}>Додати</BigButton>
                :
                <BigButton onClick={editCategory}>Зберегти</BigButton>
            }
        </form>
    );
};

export default CategoryFormPopup;
