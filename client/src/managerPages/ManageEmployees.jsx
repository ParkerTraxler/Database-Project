import React from 'react'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'

const ManageEmployees = () => {
    console.log("ManageEmployees")

    return(
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                Manage Employees
            </div>
            
        </div>
    )
}

export default ManageEmployees