import React from 'react'
import ManagerNav from './ManagerNav'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import './ManagerDashboard.css'
import './EditExhibit'

const EditExhibit = () => {
    console.log("EditExhibit")
    const { user } = useAuth()
    const token = user.token
    const [exhibit, setExhibit] = useState({
        exhibitname:"", 
        exhibitdesc:"", 
        exhibitpic:"",
    })
    
    const navigate = useNavigate()
    const location = useLocation()
    
    const handleChange = (e) =>{ // given target to given value
        setExhibit(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(exhibit)
    }
    
    const exhibitID = location.pathname.split("/")[2]
    console.log(exhibitID)

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/exhibits/", {
                exhibitid: exhibitID,
                exhibitname: exhibit.exhibitname, 
                exhibitdesc: exhibit.exhibitdesc, 
                exhibitpic: exhibit.exhibitpic,
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
        
        <div className="edit-exhibit-container">
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div>
            <div className="form">
                <h1>Edit Exhibit</h1>
                <input type="text" placeholder="name" onChange={handleChange} name="exhibitname"/>
                <input type="text" placeholder="desc" onChange={handleChange} name="exhibitdesc"/>
                <input type="text" placeholder="image" onChange={handleChange} name="exhibitpic"/> 
                <button className="formButton" onClick={handleClick} >Update</button>
                    
            </div>
            </div>
        </div>  
        </div>
    )
}

export default EditExhibit