import React from 'react'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'

const ManageSpecialExhibits = () => {
    console.log("ManageSpecialExhibits")

    return(
        
        
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                Manage Special Exhibits
            </div>
            
        </div>
    )
}

export default ManageSpecialExhibits