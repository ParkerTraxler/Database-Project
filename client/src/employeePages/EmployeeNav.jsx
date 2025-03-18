import React from 'react'
import './EmployeeNav.css'

const EmployeeNav = () => {
    console.log("EmployeeNav")

    return(
        <div className='employeeNav'>
            <h1>Employee Dashboard</h1>

            <div className='links'>
                <ul className='dashLinks'>
                    <li>
                        <a href='/employee-account-details'>Account Details</a>
                    </li>
                    <li>
                        <a href='/edit-employee-account'>Edit Employee Account</a>
                    </li>
                    <li>
                        <a href='/employee-gift-shop'>Manage Gift Shop</a>
                    </li> 
                    <li>
                        <a href='/employee-exhibits'>Manage Exhibits</a>
                    </li>
                </ul>
            </div>

        </div>
    )
}

export default EmployeeNav