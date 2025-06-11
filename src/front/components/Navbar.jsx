import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();
	const isAuthenticated = store.token || localStorage.getItem("token");

	const handleLogout = () => {
		dispatch({ type: "set_token", payload: null });
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container">
				<Link to="/" className="navbar-brand">
					React Auth App
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						{!isAuthenticated ? (
							<>
								<li className="nav-item">
									<Link to="/login" className="nav-link">
										Iniciar Sesión
									</Link>
								</li>
								<li className="nav-item">
									<Link to="/signup" className="nav-link">
										Registrarse
									</Link>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<Link to="/private" className="nav-link">
										Área Privada
									</Link>
								</li>
								<li className="nav-item">
									<button
										onClick={handleLogout}
										className="nav-link btn btn-link"
									>
										Cerrar Sesión
									</button>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};