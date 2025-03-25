import React from 'react'
import ManagerNav from './ManagerNav'
import { useState, useEffect } from 'react';
import axios from 'axios'; // API calls
import { useAuth } from '../utils/AuthContext';

import './ManagerDashboard.css'


const EmployeeExhibitReport = () => {
    console.log("EmployeeExhibitReport")

    const [employees, setEmployees] = useState([])
    const { user } = useAuth()
    const token = user.token
    console.log("token: " + token)

    useEffect(()=>{
        const fetchAllEmployees = async ()=>{
            try{
                const res = await axios.get("http://localhost:3002/employees/report", {
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
    

    return(
        
        
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div>
                <h1>Employee Exhibit Report</h1>
                <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>ID</th>
                        <th>Weekly Wage</th>
                        <th>Exhibit</th>
                        <th>Active</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee=>(

                        <tr key={employee.EmployeeID}>
                            <td>{employee.Employee_Name}</td>
                            <td>{employee.Employee_Email}</td>
                            <td>{employee.Employee_ID}</td>
                            <td>{employee.Employee_Weekly_Wage}</td>
                            <td>{employee.Exhibit_Name}</td>
                            <td>{employee.Employee_Active}</td>
                            

                        </tr>
                        
                    ))}
                </tbody>
                </table>
            </div>
            
        </div>
    )
}

export default EmployeeExhibitReport