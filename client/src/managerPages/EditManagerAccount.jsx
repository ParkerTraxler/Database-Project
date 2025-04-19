import React from 'react'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'

const EditManagerAccount = () => {
    console.log("EditManagerAccount")

    return(
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                Edit Manager Account
            </div>
            
        </div>
    )
}

export default EditManagerAccount