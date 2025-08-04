import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container d-flex justify-content-between align-items-center">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div>
					<Link to="/signup" className="btn btn-outline-primary mx-1">
						Registro
					</Link>
					<Link to="/login" className="btn btn-outline-success mx-1">
						Login
					</Link>
					<Link to="/private" className="btn btn-outline-danger mx-1">
						Privado
					</Link>
					<Link to="/demo" className="btn btn-primary mx-1">
						Context Demo
					</Link>
				</div>
			</div>
		</nav>
	);
};