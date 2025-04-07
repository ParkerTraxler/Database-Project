import React from 'react'
import { useAuth } from '../utils/AuthContext'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'
import './ManageEmployee.css'

const ManageEmployees = () => {
    console.log("ManageEmployees")
    const [employees, setEmployees] = useState([])
    const { user } = useAuth()
    const token = user.token
    console.log("token: " + token)

    useEffect(()=>{
        const fetchAllEmployees = async ()=>{
            try{
                const res = await axios.get("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/employees", {
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                })
                console.log(res.data)
                setEmployees(res.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchAllEmployees()
    },[])

    const handleDelete = async (email)=>{
        console.log(email)
        try{
            const res = await axios.delete("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/employees/", {
                headers: {
                    'authorization': `Bearer ${token}`
                },
                data: {empEmail: email}
            })
            console.log(res.data)
            window.location.reload() //refreshes the page
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    }


    return(
        <div className="manage-employees-container">
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div className="manage-employees-section">
                <h1 className="manage-employees-header">Employees</h1>
                <table>
                <thead>
                    <tr>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Position</th>
                        <th>Hourly Wage</th>
                        <th>Weekly Hours</th>
                        <th>Manager ID</th>
                        <th>Birth Date</th>
                        <th>Gender</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee=>(

                        <tr key={employee.EmployeeID}>
                            <td>{employee.LastName}</td>
                            <td>{employee.FirstName}</td>
                            <td>{employee.EmployeeID}</td>
                            <td>{employee.Email}</td>
                            <td>{employee.EPosition}</td>
                            <td>{employee.HourlyWage}</td>
                            <td>{employee.WeeklyHours}</td>
                            <td>{employee.ManagerID}</td>
                            <td>{new Date(employee.BirthDate).toLocaleDateString()}</td>
                            <td>{employee.Gender}</td>
                            <td>

                                <button className="update">
                                    <Link to={`/edit-employee/${employee.Email}`}>Update</Link>
                                </button>
                                <button className="delete" onClick={()=>handleDelete(employee.Email)}>Delete</button>
                            </td>

                        </tr>
                        
                    ))}
                </tbody>
                </table>
                <button className="add-employee-button">
                    <Link to="/add-employee">Add Employee</Link>
                </button>
                </div>
            </div>
            </div>
            
        
    )
}

export default ManageEmployees