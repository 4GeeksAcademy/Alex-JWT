import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            // Si no hay token, redirige al login
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div>
            <h1>Zona Privada</h1>
            <p>Solo usuarios autenticados pueden ver esta página.</p>
        </div>
    );
};