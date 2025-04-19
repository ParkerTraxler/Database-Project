import React from 'react'
import EmployeeNav from './EmployeeNav'
import './EmployeeNav.css'
import './EditAccountEmployee.css'

const EditAccountEmployee = () => {
    console.log("EditAccountEmployee")

    return(
        <div className="employeeView">
            <div className="navBar">
                <EmployeeNav/>
            </div>
            <div className="editAccount">
            <h1>Edit Account</h1>
            <div className="detailsBox">
                <div className="detail">
                    <strong>First Name:</strong>
                    <input type="text" maxLength="28" name="firstName"></input>
                </div>
                <div className="detail">
                    <strong>Last Name:</strong>
                    <input type="text" maxLength="28" name="lastName"></input>
                </div>
                <div className="detail">
                    <strong>Address:</strong>
                    <input type="address" maxLength="70" name="address"></input>
                </div>
                <div className="detail">
                    <strong>Date of Birth:</strong>
                    <input type="date" name="birthDate"></input>
                </div>
                <div className="detail">
                    <strong>Gender:  </strong>
                    <select>
                        <option value="">---Choose an option---</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                        <option value="3">Other</option>
                    </select>
                </div>
            </div>
                <div className="detail">
                <button className="saveButton">Save Changes</button>
                </div>
            </div>
        </div>
    )
}

export default EditAccountEmployee