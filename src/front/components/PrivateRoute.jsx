import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PrivateRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    // Verificar si hay un token en el estado global o en localStorage
    const isAuthenticated = store.token || localStorage.getItem("token");

    if (!isAuthenticated) {
        // Si no hay token, redirigir al login
        return <Navigate to="/login" />;
    }

    return children;
}; 