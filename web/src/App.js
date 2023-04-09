import React, {useEffect, useState} from 'react';
import './styles/App.css'
import {ManagerContext} from "./context";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";

function App() {
    const [isManager, setIsManager] = useState(false);

    /*useEffect(() => {
        if (localStorage.getItem('manager')) {
            setIsManager(true)
        }
    }, [])*/

    return (
    <ManagerContext.Provider value={{
        isManager,
        setIsManager
    }}>
        <BrowserRouter>
            <AppRouter/>
        </BrowserRouter>
    </ManagerContext.Provider>
  );
}

export default App;
