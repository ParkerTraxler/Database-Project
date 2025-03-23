import React from 'react'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'

const ManagerAccountDetails = () => {
    console.log("ManagerAccountDetails")

    return(
        
        
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                Manager Account Details
            </div>
            
        </div>
    )
}

export default ManagerAccountDetails