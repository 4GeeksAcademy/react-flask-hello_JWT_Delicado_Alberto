import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Private = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = store.token || localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/validate-token`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Token inválido");
                }

                const data = await response.json();
                dispatch({ type: "set_user", payload: data });
            } catch (error) {
                console.error("Error validando token:", error);
                localStorage.removeItem("token");
                dispatch({ type: "set_token", payload: null });
                navigate("/login");
            }
        };

        validateToken();
    }, []);

    if (!store.user) {
        return <div>Cargando...</div>;
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