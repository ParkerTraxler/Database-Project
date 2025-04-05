import React from 'react'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'

const ManageEvents = () => {
    console.log("ManageEvents")

    return(
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                Manage Events
            </div>
            
        </div>
    )
}

export default ManageEvents