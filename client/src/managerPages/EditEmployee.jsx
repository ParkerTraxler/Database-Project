import React from 'react'
import ManagerDashboard from './ManagerNav'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { jwtDecode } from 'jwt-decode'
import './ManagerDashboard.css'

const EditEmployee = () => {
    console.log("EditEmployee")
    const { user } = useAuth()
    const token = user.token
    const decoded = jwtDecode(token)
    const managerEmail = decoded.email
    const [employee, setEmployee] = useState({
        hourlywage: "",
        weeklyhours: "",
        firstname: "",
        lastname: "",
        birthdate: "",
        ePosition: "",
        exhibitID: "",
        managerID: "",
        gender: "",
    })

    const navigate = useNavigate()
    const location = useLocation()

    const handleChange = (e) =>{ // given target to given value
        setEmployee(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(employee)
    }

    const email = location.pathname.split("/")[2]

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/employees/`, {
                hourlywage: employee.hourlywage,
                weeklyhours: employee.weeklyhours,
                firstname: employee.firstname,
                lastname: employee.lastname,
                birthdate: employee.birthdate,
                ePosition: employee.ePosition,
                exhibitID: employee.exhibitID,
                managerID: employee.managerID,
                gender: employee.gender,
                email: email,
                managerEmail: managerEmail
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
            window.alert(err.response.data.error);
        }
    }



    return(
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
            <div className="form">
                    <h1>Edit Employee</h1>
                    <input type="text" placeholder="first name" onChange={handleChange} name="firstname"/>
                    <input type="text" placeholder="last name" onChange={handleChange} name="lastname"/>
                    <input type="number" min="0" step="0.01" placeholder="hourly wage" onChange={handleChange} name="hourlywage"/>
                    <input type="number" min="0" placeholder="weekly hours" onChange={handleChange} name="weeklyhours"/>
                    <input type="date" onChange={handleChange} name="birthdate"/>
                    <input type="number" placeholder="exhibit id" onChange={handleChange} name="exhibitID"/>
                    <input type="number" placeholder="manager id" onChange={handleChange} name="managerID"/>
                    <div>
                    Position:
                    <select onChange={handleChange} name="ePosition">
                        <option value="">---Choose an option---</option>
                        <option value="Curator">Curator</option>
                        <option value="GiftShopTeam">GiftShopTeam</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                    <div>
                    Gender:
                    <select onChange={handleChange} name="gender">
                        <option value="">---Choose an option---</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                    
                    
                    <button className="formButton"  onClick={handleClick}>Update</button>
                    
                </div>
            </div>
            
        </div>
    )
}

export default EditEmployee