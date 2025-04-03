import React from 'react'
import ManagerDashboard from './ManagerNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import './ManagerDashboard.css'

const CreateExhibit = () => {
    console.log("CreateExhibit")
    const { user } = useAuth()
    const token = user.token
    console.log(token)
    const decoded = jwtDecode(token)
    const email = decoded.email
        
    const [exhibit, setExhibit] = useState({
        exhibitname:"", 
        exhibitdesc:"", 
        exhibitpic:"",
    })

    const handleChange = (e) =>{ // given target to given value
        console.log(e.target.name, e.target.value);
        
        setExhibit(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(exhibit)
    }

    const navigate = useNavigate()

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click

        console.log("Exhibit object being sent:", exhibit);  // Debug the exhibit state before sending
        
        try{
            const res = await axios.post("http://localhost:3002/exhibits/", {
                exhibitname: exhibit.exhibitname, 
                exhibitdesc: exhibit.exhibitdesc, 
                exhibitpic: exhibit.exhibitpic,
                isSpecial: 0,
                managerEmail: email
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log(res.end)
            
            navigate("/manage-exhibits")
        }
        catch(err){
            console.log(err)
        }
    }

    return(
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                <div className="form">
                    <h1>Create Exhibit</h1>
                    <input type="text" placeholder="name" onChange={handleChange} name="exhibitname"/>
                    <input type="text" placeholder="desc" onChange={handleChange} name="exhibitdesc"/>
                    <input type="text" placeholder="image" onChange={handleChange} name="exhibitpic"/>
                    <button className="formButton" onClick={handleClick} >Add</button>
                </div>
            </div>
            
        </div>
    )
}

export default CreateExhibit