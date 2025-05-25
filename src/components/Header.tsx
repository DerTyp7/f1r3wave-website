import "@styles/Header.scss";
import { useLocation, Link } from "react-router-dom";
import logo from "@assets/logo_text.png";

export default function Header() {
	const location = useLocation();
	const isActive = (path: string) => location.pathname === path;

	return (
		<div className="header">
			<Link to="/">
				<img className="header__logo" src={logo} alt="Logo F1r3wave" />
			</Link>
			<nav className="header-nav">
				<Link
					to="/"
					className={`header-nav__link ${
						isActive("/") ? "header-nav__link--active" : ""
					}`}
				>
					Home
				</Link>
				<Link
					to="/gallery"
					className={`header-nav__link ${
						isActive("/gallery") ? "header-nav__link--active" : ""
					}`}
				>
					Gallery
				</Link>
				<Link
					to="/contact"
					className={`header-nav__link ${
						isActive("/contact") ? "header-nav__link--active" : ""
					}`}
				>
					Contact
				</Link>
			</nav>
		</div>
	);
}
