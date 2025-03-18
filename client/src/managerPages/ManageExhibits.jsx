import React from 'react'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'

const ManageExhibits = () => {
    console.log("ManageExhibits")

    return(
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                Manage Exhibits
            </div>  
        </div>
    )
}

export default ManageExhibits