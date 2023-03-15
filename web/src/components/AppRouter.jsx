import React, {useContext} from 'react';
import {managerRoutes, cashierRoutes} from "../router";
import {ManagerContext} from "../context";
import {Route, Routes} from "react-router-dom";

const AppRouter = () => {
    const {isManager, setIsManager} = useContext(ManagerContext);

    return (
        isManager
            ?
            <Routes>
                {managerRoutes.map(route =>
                    <Route
                        element={route.element}
                        path={route.path}
                        exact={route.exact}
                        key={route.path}
                    />
                )}
            </Routes>
            :
            <Routes>
                {cashierRoutes.map(route =>
                    <Route
                        element={route.element}
                        path={route.path}
                        exact={route.exact}
                        key={route.path}
                    />
                )}
            </Routes>
    );
};

export default AppRouter;
