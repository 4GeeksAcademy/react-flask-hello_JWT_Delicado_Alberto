import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Private = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = store.token || sessionStorage.getItem("token");
                if (!token) {
                    console.log("No token found");
                    navigate("/login");
                    return;
                }

                console.log("Token being sent:", token);

                const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '');
                const response = await fetch(
                    `${baseUrl}/api/validate-token`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        }
                    }
                );

                console.log("Response status:", response.status);
                const data = await response.json();
                console.log("Response data:", data);

                if (!response.ok) {
                    throw new Error(data.message || "Token inválido");
                }

                dispatch({ type: "set_user", payload: data });
                setError("");
            } catch (error) {
                console.error("Error validando token:", error);
                setError(error.message);
                sessionStorage.removeItem("token");
                dispatch({ type: "set_token", payload: null });
                navigate("/login");
            }
        };

        validateToken();
    }, []);

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    Error: {error}
                </div>
            </div>
        );
    }

    if (!store.user) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Página Privada</h2>
                            <p className="card-text">
                                ¡Bienvenido! Esta es una página privada que solo pueden ver los usuarios autenticados.
                            </p>
                            <p className="card-text">
                                Tu email es: {store.user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 