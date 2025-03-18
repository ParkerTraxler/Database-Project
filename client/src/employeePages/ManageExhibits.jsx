import React from 'react'
import EmployeeNav from './EmployeeNav'
import './EmployeeNav.css'

const ManageExhibits = () => {
    console.log("ManageExhibit")

    return(
        <div className="employeeView">
            <div className="navBar">
                <EmployeeNav/>
            </div>
            <div className="editExhibits">
                Edit exhibits
            </div>

        </div>
    )
}

export default ManageExhibits