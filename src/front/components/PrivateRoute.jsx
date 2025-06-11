import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PrivateRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    const isAuthenticated = store.token || sessionStorage.getItem("token");

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}; 