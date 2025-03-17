import react from 'react'
import { useState } from 'react';
import { useAuth } from "./utils/AuthContext.js"
import './Navbar.css'

const Navbar = () => {
    const {user, logout} = useAuth()
    const role = user?.role

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
                {!user && (<>
                    <a href="/log-in">Log In</a>
                    <a href="/sign-up">Sign Up</a>
                </>)}
                {role == 'customer' && (<>
                    <a href="/" onClick={logout}>Log Out</a>
                    <a href="/account-details">Account</a>
                </>)}
                {role == 'manager' && (<>
                    <a href="/" onClick={logout}>Log Out</a>
                    <a href="/manager-dashboard">Dashboard</a>
                </>)}
                
                
                
            </div>
        </nav>
    );

};


export default Navbar;
