import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(
        sessionStorage.getItem("name") || ""
    );

    return (
        <AuthContext.Provider value={{ userName, setUserName }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AuthContext);
};

