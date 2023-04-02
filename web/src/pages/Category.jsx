import React, {useState} from 'react';
import Navbar from "../components/UI/Navbar/Navbar";
import Searchbar from "../components/UI/SearchBar/Searchbar";
import Checkbox from "../components/UI/inputs/checkbox/Checkbox";
import RoundButton from "../components/UI/buttons/RoundButton";
import edit from "../assets/images/edit.svg";
import PrintButton from "../components/UI/buttons/PrintButton";
import Select from "../components/UI/select/Select";
import Table from "../components/UI/table/Table";
import CustomerFormPopup from "../components/popups/CustomerFormPopup";
import ModalForm from "../components/UI/Modal/ModalForm";
import CategoryFormPopup from "../components/popups/CategoryFormPopup";
import ProductFormPopup from "../components/popups/ProductFormPopup";

const Category = () => {
    const [categories, setCategories] = useState( [
        {
            catNo:'111111111',
            name:'Бакалія'
        },
        {
            catNo:'222222222',
            name:'Солодощі'
        },
        {
            catNo:'3333333333',
            name:'Хлібобулочні вироби'
        },
        {
            catNo:'4444444444',
            name:'Напої'
        },
        {
            catNo:'555555555',
            name:'Молочні продукти'
        }
    ]);
    const [selectedRowCategory, setSelectedRowCategory] = useState({
        catNo:'',
        name:''
    });
    const tableDataCategory = ["Номер", 'Назва'];
    const [select, setSelect] = useState("Категорія")
    const [products, setProducts] = useState( [
        {
            ID:'1234567891',
            name:'Хліб Київхліб Супер тост світлий нарізаний 350г',
            category: 'Хлібобулочні вироби',
            manufacturer:'ТД "Золотий Урожай"',
            characteristics:'Тостовий різаний хліб ідеально підходить для смаження на сковороді та приготування тостів.'
        },
        {
            ID:'1234567890',
            name:'Рис',
            category: 'Бакалія',
            manufacturer:'Єгипет',
            characteristics:'дуже смачний рис, напевно'
        },
        {
            ID:'1234567892',
            name:'Шоколад',
            category: 'Солодощі',
            manufacturer:'Рошен',
            characteristics:'порошенко вподобав допис'
        }
    ]);
    const filteredProducts = select!=="Категорія" ? products.filter(product => product.category===select) : products
    const [selectedRowProduct, setSelectedRowProduct] = useState({
        ID:'',
        name:'',
        category: '',
        manufacturer:'',
        characteristics:''
    });
    const tableDataProduct = ["ID", 'Назва',"Категорія", "Виробник", "Характеристика"];
    const [modalCategory, setModalCategory] = useState(false);
    const [modalProduct, setModalProduct] = useState(false);

    function handleAddCategory() {
        setSelectedRowCategory(undefined);
        setModalCategory(true);
    }
    function handleEditCategory() {
        if (selectedRowCategory.catNo===''){
            alert('Виберіть категорію для редагування')
        } else {
            setModalCategory(true)
        }
    }
    function handleDeleteCategory() {
        if (selectedRowCategory.catNo===''){
            alert('Виберіть категорію для видалення')
        } else {
            setCategories(prevCustomers => prevCustomers.filter(category => category.catNo !== selectedRowCategory.catNo));
        }
    }
    const createCategory = (newCategory) => {
        setCategories(prevCategories => [...prevCategories, newCategory]);
        setModalCategory(false)
    }
    const editCategory = (newCategory, catNo) => {
        newCategory.catNo=catNo
        setCategories(categories.map(e => {
            if (e.catNo===catNo){
                return newCategory;
            }
            return e
        }));
        setModalCategory(false)
    }
    function handleAddProduct() {
        setSelectedRowProduct(undefined);
        setModalProduct(true);
    }
    function handleEditProduct() {
        if (selectedRowProduct.ID===''){
            alert('Виберіть категорію для редагування')
        } else {
            setModalProduct(true)
        }
    }
    function handleDeleteProduct() {
        if (selectedRowProduct.ID===''){
            alert('Виберіть категорію для видалення')
        } else {
            setProducts(prevProducts => prevProducts.filter(product => product.ID !== selectedRowProduct.ID));
        }
    }
    const createProduct = (newProduct) => {
        setProducts(prevProducts => [...prevProducts, newProduct]);
        setModalProduct(false);
    }
    const editProduct = (newProduct, ID) => {
        newProduct.ID=ID
        setProducts(products.map(e => {
            if (e.ID===ID){
                return newProduct;
            }
            return e
        }));
        setModalProduct(false)
    }
    return (
        <div>
            <Navbar/>
            <div className="filter">
                <div className="filter-right">
                    <PrintButton/>
                    <RoundButton onClick={handleEditCategory}><img src={edit} width="14px" height="12px"/></RoundButton>
                    <RoundButton onClick={handleDeleteCategory}>&minus;</RoundButton>
                    <RoundButton onClick={handleAddCategory}>+</RoundButton>
                </div>
                <ModalForm visible={modalCategory} setVisible={setModalCategory}>
                    <CategoryFormPopup setVisible={setModalCategory} create={createCategory} edit={editCategory} selectedRow={selectedRowCategory===undefined ? undefined : categories.find(category => category.catNo === selectedRowCategory.catNo)}/>
                </ModalForm>
                <div className="filter-left">
                    <Select onChange={(e) => setSelect(e.target.value)}>
                        <option key={-1} value={"Категорія"}>Категорія</option>
                        {
                            categories.map((item, index) => (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))
                        }
                    </Select>
                    <RoundButton onClick={handleAddProduct}>+</RoundButton>
                    <RoundButton onClick={handleDeleteProduct}>&minus;</RoundButton>
                    <RoundButton onClick={handleEditProduct}><img src={edit} width="14px" height="12px"/></RoundButton>
                    <PrintButton/>
                </div>
                <ModalForm visible={modalProduct} setVisible={setModalProduct}>
                    <ProductFormPopup
                        setVisible={setModalProduct}
                        create={createProduct}
                        edit={editProduct}
                        selectedRow={selectedRowProduct===undefined ? undefined : products.find(product => product.ID === selectedRowProduct.ID)}/>
                </ModalForm>
            </div>
            <div className="two-tables-div">
                <Table tableData={tableDataCategory} rowData={categories} setSelectedRow={setSelectedRowCategory}/>
                <Table tableData={tableDataProduct} rowData={filteredProducts} setSelectedRow={setSelectedRowProduct}/>
            </div>
        </div>
    );
};

export default Category;
