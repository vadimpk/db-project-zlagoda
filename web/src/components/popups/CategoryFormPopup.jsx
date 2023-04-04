import React, {useState} from 'react';
import RoundButton from "../UI/buttons/RoundButton";
import BigButton from "../UI/buttons/BigButton";
import InputTextForm from "../UI/inputs/text-password/InputTextForm";

const CategoryFormPopup = ({setVisible, create, selectedRow, edit}) => {
    const [category, setCategory] = useState(selectedRow ||
        {
            id:  0,
            name: ''
        });

    const addNewCategory = (e) => {
        e.preventDefault()
        if (validateForm()) {
            create(category)
        }
        setCategory({
            id:  0,
            name: ''
            })
        setVisible(false)
    }
    const editCategory = (e) => {
        e.preventDefault()
        setCategory({...category, id: selectedRow.id})
        if (validateForm()) {
            edit(category, selectedRow.id)
        }
        setCategory({
            id:  0,
            name: ''
            })
        setVisible(false)
    }
    const validateForm = () => {
        const nameRegex = /^[іїа-яА-Я\s]+$/;
        const numberRegex = /^\d+$/;
        const errors = {};

        if (!category.name || !nameRegex.test(category.name.trim())) {
            errors.name = 'Некоректна назва категорії';
        }
        if ((!numberRegex.test(category.id.trim()))&&selectedRow===undefined) {
            errors.id = 'Некоректний номер категорії';
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
                        name={"id"}
                        placeholder={"Номер категорії"}
                        value={ selectedRow===undefined ? category.id : selectedRow.id}
                        onChange={e => setCategory({...category, id: e.target.value})}>Номер категорії</InputTextForm>
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
