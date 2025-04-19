import React from 'react'
import ManagerDashboard from './ManagerNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import './ManagerDashboard.css'
import './CreateExhibit.css'

const CreateExhibit = () => {
    console.log("CreateExhibit")
    const { user } = useAuth()
    const token = user.token
    console.log(token)
        
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
            const res = await axios.post(`http://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/exhibits/`, {
                exhibitname: exhibit.exhibitname, 
                exhibitdesc: exhibit.exhibitdesc, 
                exhibitpic: exhibit.exhibitpic,
                isSpecial: 0,
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            navigate("/manage-exhibits")
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    }

    return(
        <div className="create-exhibit-container">
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                <div className="create-exhibit-form">
                    <h1>Create Exhibit</h1>
                    <input type="text" placeholder="name" onChange={handleChange} name="exhibitname"/>
                    <input type="text" placeholder="desc" onChange={handleChange} name="exhibitdesc"/>
                    <input type="text" placeholder="image" onChange={handleChange} name="exhibitpic"/>
                    <button className="formButton" onClick={handleClick} >Add</button>
                </div>
            </div>
        </div>   
        </div>
    )
}

export default CreateExhibit