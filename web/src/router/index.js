import Employees from "../pages/Employees";
import Customers from "../pages/Customers";
import Checks from "../pages/Checks";
import Products from "../pages/Products";
import Login from "../pages/Login";


export const managerRoutes = [
    {path: '/', element: <Login/>, exact: true},
    {path: '/employees', element: <Employees/>, exact: true},
    {path: '/customers', element: <Customers/>, exact: true},
    {path: '/checks', element: <Checks/>, exact: true},
    {path: '/products', element: <Products/>, exact: true}
]

export const cashierRoutes = [
    {path: '/', element: <Login/>, exact: true},
    {path: '/customers', element: <Customers/>, exact: true},
    {path: '/checks', element: <Checks/>, exact: true},
    {path: '/products', element: <Products/>, exact: true}
]
