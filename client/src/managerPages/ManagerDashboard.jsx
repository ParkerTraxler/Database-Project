import React from 'react'
import ManagerNav from './ManagerNav'
import './ManagerDashboard.css'

const ManagerDashboard = () => {
    console.log("ManagerDashboard")

    return(
        
        
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div>
                Manager Dashboard
            </div>
            
        </div>
    )
}

export default ManagerDashboard