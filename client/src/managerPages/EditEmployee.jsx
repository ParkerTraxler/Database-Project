import React from 'react'
import ManagerDashboard from './ManagerNav'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { jwtDecode } from 'jwt-decode'
import './ManagerDashboard.css'
import './EditEmployee.css'

const EditEmployee = () => {
    console.log("EditEmployee")
    const { user } = useAuth()
    const token = user.token
    const decoded = jwtDecode(token)
    const managerEmail = decoded.email
    const [exhibits, setExhibits] = useState([])
    const [managers, setManagers] = useState([])
    const [employee, setEmployee] = useState({
        HourlyWage: "",
        WeeklyHours: "",
        FirstName: "",
        LastName: "",
        BirthDate: "",
        EPosition: "",
        ExhibitID: "",
        ManagerID: "",
        Gender: "",
    })

    useEffect(()=>{
        const fetchAllExhibits = async ()=>{
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/exhibits`)
                console.log(res.data)
                setExhibits(res.data);
                
            }catch(err){
                window.alert(err.response.data.error);
            }
        }
        fetchAllExhibits()
    },[])

    useEffect(()=>{
        const fetchAllManagers = async ()=>{
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/managers`)
                console.log(res.data)
                setManagers(res.data);
                
            }catch(err){
                window.alert(err.response.data.error);
            }
        }
        fetchAllManagers()
    },[])

    

    const navigate = useNavigate()
    const location = useLocation()

    const handleChange = (e) =>{ // given target to given value
        setEmployee(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(employee)
    }

    const email = location.pathname.split("/")[2]

    useEffect(()=>{
        const fetchEmployee = async ()=>{
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/employees/${email}`,
                    {
                        headers: {
                            'authorization': `Bearer ${token}`
                        },
                    }
                )
                console.log(res.data)
                setEmployee(res.data);
            }catch(err){
                console.log(err)
            }
        }
        fetchEmployee()
    },[])

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/employees/`, {
                hourlywage: employee.HourlyWage,
                weeklyhours: employee.WeeklyHours,
                firstname: employee.FirstName,
                lastname: employee.LastName,
                birthdate: employee.BirthDate ? employee.BirthDate.split("T")[0] : null,
                ePosition: employee.EPosition,
                exhibitID: employee.ExhibitID,
                managerID: employee.ManagerID,
                gender: employee.Gender,
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
        <div className="edit-employee-container">
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
            <div className="edit-employee-form">
                    <h1>Edit Employee</h1>
                    <input className="edit-employee-input" type="text" value={employee.FirstName} placeholder="first name" onChange={handleChange} name="FirstName"/>
                    <input className="edit-employee-input" type="text" value={employee.LastName} placeholder="last name" onChange={handleChange} name="LastName"/>
                    <input className="edit-employee-input" type="number" value={employee.HourlyWage} min="0" step="0.01" placeholder="hourly wage" onChange={handleChange} name="HourlyWage"/>
                    <input className="edit-employee-input" type="number" value={employee.WeeklyHours} min="0" placeholder="weekly hours" onChange={handleChange} name="WeeklyHours"/>
                    <input className="edit-employee-input" type="date" value={employee?.BirthDate ? new Date(employee.BirthDate).toISOString().split("T")[0] : ""} onChange={handleChange} name="BirthDate"/>
                    <select className="edit-employee-input" value={employee.ExhibitID || ""} onChange={handleChange} name="ExhibitID">
                        <option value="">--- Select an Exhibit ---</option>
                        {exhibits.map((exhibit) => (
                            <option key={exhibit.ExhibitID} value={exhibit.ExhibitID}>
                                {exhibit.ExhibitName}
                            </option>
                        ))}
                    </select>
                    <div>Manager:
                    <select className="edit-employee-input" value={employee.ManagerID || ""} onChange={handleChange} name="ManagerID">
                        <option value="">--- Assign to a Manager ---</option>
                        {managers.map((manager) => (
                            <option key={manager.ManagerID} value={manager.ManagerID}>
                                {manager.Name}
                            </option>
                        ))}
                    </select>
                    </div>
                    <div>
                    Position:
                    <select className="edit-employee-input" value={employee.EPosition} onChange={handleChange} name="EPosition">
                        <option value="">---Choose an option---</option>
                        <option value="Curator">Curator</option>
                        <option value="GiftShopTeam">GiftShopTeam</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                    <div>
                    Gender:
                    <select className="edit-employee-input" value={employee.Gender} onChange={handleChange} name="Gender">
                        <option value="">---Choose an option---</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                    
                    
                    <button className="edit-employee-formButton"  onClick={handleClick}>Update</button>
                    
                </div>
            </div>
        </div>        
        </div>
    )
}

export default EditEmployee