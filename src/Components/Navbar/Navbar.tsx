import './Navbar.css'
import {Link} from "react-router";

export default function Navbar() {
    return (
        <div className="navbar">
            <h1 className="navbar-brand">Orderly</h1>
            <Link to="/"><div className="navbar_link">Home</div></Link>
            <Link to="/shops"><div className="navbar_link">Shop</div></Link>
            <Link to="/cart"><div className="navbar_link">Cart</div></Link>
        </div>
    )
}