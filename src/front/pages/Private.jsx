import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        // Validar token con el backend
        const fetchPrivateData = async () => {
            try {
                const res = await fetch("https://upgraded-happiness-gwjr54v5q96cv9v7-3001.app.github.dev/private", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Acceso no autorizado");
                }

                const data = await res.json();
                setMessage(data.msg);
            } catch (err) {
                console.error(err);
                setError(err.message);
                sessionStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchPrivateData();
    }, [navigate]);

    return (
        <div>
            <h1>Zona Privada</h1>
            {message ? (
                <p>{message}</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
};