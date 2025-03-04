import react from 'react'
import './Navbar.css'

const Navbar = () => {
    return (

        <nav className="navbar">
            {/*navbar content here*/}
            <div className="navbar-left">
                <a href="/">Art Museum</a>
            </div>
            <div className="navbar-center">
                <ul className="nav-links">
                    <li>
                        <a href="/collections">Collections</a>
                    </li>
                    <li>
                        <a href="/exhibits">Exhibits</a>
                    </li>
                    <li>
                        <a href="/events">Events</a>
                    </li>
                    <li>
                        <a href="/tickets">Tickets</a>
                    </li>
                    <li>
                        <a href="/gift-shop">Gift Shop</a>
                    </li>
                    <li>
                        <a href="/reviews">Reviews</a>
                    </li>
                </ul>
            </div>
            <div className="navbar-right">
                <a href="/log-in">Log In</a>
                <a href="/sign-up">Sign Up</a>
                <a href="/account-details">Account</a>
            </div>
        </nav>
    );

};


export default Navbar;
