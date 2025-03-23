import React from 'react'
import './Footer.css'


const Footer = () => {

    return(
        <div className='footer'>
            <footer>
                <p>&copy; {new Date().getFullYear()} Shasta's Fine Arts Museum. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Footer