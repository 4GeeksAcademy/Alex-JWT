import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/" className="navbar-brand mb-0 h1">React Boilerplate</Link>
				<div>
					<Link to="/signup" className="btn btn-outline-primary me-2">Signup</Link>
					<Link to="/login" className="btn btn-outline-success me-2">Login</Link>
					<button onClick={handleLogout} className="btn btn-danger">Logout</button>
				</div>
			</div>
		</nav>
	);
};