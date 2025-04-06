import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'
import './AddEmployee.css'

const AddEmployee = () => {
    console.log("AddEmployee")
    const { user } = useAuth()
    const token = user.token
    console.log(token)
    
    const [employee, setEmployee] = useState({
        email:"",
        firstName:"",
        lastName:"",
        position:"",
        managerEmail: null,
    })

    const handleChange = (e) =>{ // given target to given value
        
        setEmployee(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(employee)
    }

    const navigate = useNavigate()

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.post("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/employees", {
                email: employee.email,
                firstName: employee.firstName,
                lastName: employee.lastName,
                position: employee.position,
                managerEmail: employee.managerEmail,
                
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log(res.end)
            
            navigate("/manage-employees")
        }
        catch(err){
            console.log(err)
        }
    }



    return(
        <div className="add-employee-container">
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                <div className="add-employee-form">
                    <h1 className="add-employee-header">Add Employee</h1>
                    <input type="text" placeholder="email" onChange={handleChange} name="email"/>
                    <input type="text" placeholder="first name" onChange={handleChange} name="firstName"/>
                    <input type="text" placeholder="last name" onChange={handleChange} name="lastName"/>
                    <div>

                    <select onChange={handleChange} name="position">
                        <option value="">---Choose an option---</option>
                        <option value="Curator">Curator</option>
                        <option value="GiftShopTeam">GiftShopTeam</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                    <input type="text" placeholder="manager email" onChange={handleChange} name="managerEmail"/>
                    <button className="add-employee-formButton" onClick={handleClick} >Add</button>
                </div>
            </div>  
        </div>
        </div>
    )
}

export default AddEmployee