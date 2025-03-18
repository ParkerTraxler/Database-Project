import React from 'react'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'

const ManageCollections = () => {
    console.log("ManageCollections")

    return(
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                Manage Collections
            </div>
            
        </div>
    )
}

export default ManageCollections