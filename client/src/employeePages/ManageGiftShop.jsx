import React from 'react'
import EmployeeNav from './EmployeeNav'
import './EmployeeNav.css'

const ManageGiftShop = () => {
    console.log("ManageGiftShop")

    return(
        <div className="employeeView">
            <div className="navBar">
                <EmployeeNav/>
            </div>
            <div className="editGiftShop">
                Edit gift shop
            </div>

        </div>
    )
}

export default ManageGiftShop