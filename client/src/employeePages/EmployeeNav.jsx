import React from 'react'
import { useAuth } from '../utils/AuthContext'
import './EmployeeNav.css'

const EmployeeNav = () => {
    console.log("EmployeeNav")
    const { user } = useAuth()
    const position = user.position

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
                    {position == 'Curator' && (
                        <li>
                            <a href='/manage-collections'>Manage Collections</a>
                        </li>
                    )}
                    {position == 'GiftShopTeam' && (
                        <li>
                            <a href='/manage-gift-shop'>Manage Gift Shop</a>
                        </li>
                    )}
                    {position == 'GiftShopTeam' && (
                        <li>
                            <a href='/log-transactions'>Log Transactions</a>
                        </li>
                    )}
                    
                </ul>
            </div>

        </div>
    )
}

export default EmployeeNav