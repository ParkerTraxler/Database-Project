import React from 'react'
import './ManagerDashboard.css'

const ManagerDashboard = () => {
    console.log("ManagerDashboard")

    return(
        <div className='managerDashboard'>
            <h1>Manager Dashboard</h1>

            <div className='links'>
                <ul className='dashLinks'>
                    <li>
                        <a href='/manager-account-details'>Account Details</a>
                    </li>
                    <li>
                        <a href='/edit-manager-account'>Edit Manager Account</a>
                    </li>
                    <li>
                        <a href='/manage-employees'>Manage Employees</a>
                    </li>
                    <li>
                        <a href='/manage-exhibits'>Manage Exhibits</a>
                    </li>
                    <li>
                        <a href='/manage-events'>Manage Events</a>
                    </li>
                    <li>
                        <a href='/manage-collections'>Manage Collections</a>
                    </li>
                    <li>
                        <a href='/manage-tickets'>Manage Tickets</a>
                    </li>
                    <li>
                        <a href='/manage-gift-shop'>Manage Gift Shop</a>
                    </li>
                    <li>
                        <a href='/view-donations'>View Donations</a>
                    </li>
                    <li>
                        <a href='/employee-exhibit-report'>Employee Exhibit Report</a>
                    </li>
                    
                </ul>
            </div>

        </div>
    )
}

export default ManagerDashboard