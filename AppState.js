// State global pour gérer l'ip et le port du serveur
import React, { useState, useContext } from 'react';

const AppStateContext = React.createContext();

export const AppStateProvider = ({ children }) => {
    const [ip, setIp] = useState('192.168.1.26'); // Donnée de base pour faciliter le développement
    const [port, setPort] = useState('8000');

    return (
        <AppStateContext.Provider value={{ ip, setIp, port, setPort }}>
            {children}
        </AppStateContext.Provider>
    );
};

// Permet l'appel et l'utilisation du state dans les tabs
export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};
