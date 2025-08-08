import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isLogged, setIsLogged] = useState(false);

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		setIsLogged(!!token);
	}, [location]); // Actualiza al cambiar la ruta

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		setIsLogged(false);
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/" className="navbar-brand mb-0 h1">React Boilerplate</Link>
				<div>
					{!isLogged ? (
						<>
							<Link to="/signup" className="btn btn-outline-primary me-2">Signup</Link>
							<Link to="/login" className="btn btn-outline-success me-2">Login</Link>
						</>
					) : (
						<button onClick={handleLogout} className="btn btn-danger">Logout</button>
					)}
				</div>
			</div>
		</nav>
	);
};