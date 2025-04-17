import React, { useState } from 'react'
import './ManagerDashboard.css'

const ManagerDashboard = () => {
    const [showReports, setShowReports] = useState(false)

    const toggleReports = () => {
        setShowReports(prev => !prev)
    }

    return (
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
                        <a href='/manage-tickets'>Manage Tickets</a>
                    </li>
                    <li>
                        <a href='/view-donations'>View Donations</a>
                    </li>

                    {/* reports dropdown thingy (lowkey messy code, took me a while to get ts to work) */}
                    <li>
                        <button onClick={toggleReports} className='dropdown-toggle'>
                            View Reports {showReports ? '▲' : '▼'}
                        </button>
                        {showReports && (
                            <ul className='dropdown'>
                                <li>
                                    <a href='/customers-report'>Customer Report</a>
                                </li>
                                <li>
                                    <a href='/gift-shop-sales-report'>Gift Shop Sales Report</a>
                                </li>
                                <li>
                                    <a href='/employee-exhibit-report'>Exhibit Spending Report</a>
                                </li>
                                <li>
                                    <a href='/edit-history-report'>Edit History Report</a>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ManagerDashboard
