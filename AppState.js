// src/AppState.js

import React, { useState, useContext } from 'react';

const AppStateContext = React.createContext();

export const AppStateProvider = ({ children }) => {
    const [ip, setIp] = useState('192.168.1.26');
    const [port, setPort] = useState('8000');

    return (
        <AppStateContext.Provider value={{ ip, setIp, port, setPort }}>
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};
