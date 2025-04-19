import React from 'react'
import ManagerNav from './ManagerNav'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { jwtDecode } from 'jwt-decode'
import './ManagerDashboard.css'
import './EditSpecialExhibits.css'

const EditSpecialExhibit = () => {
    console.log("EditSpecialExhibit")
    const { user } = useAuth()
    const token = user.token
    const decoded = jwtDecode(token)
    const email = decoded.email
    const [specialExhibit, setSpecialExhibit] = useState({
        exhibitname:"", 
        exhibitdesc:"", 
        exhibitpic:"",
        startdate:"",
        enddate:"",
        fee:"",
    })
    
    const navigate = useNavigate()
    const location = useLocation()
    
    const handleChange = (e) =>{ // given target to given value
        setSpecialExhibit(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(specialExhibit)
    }
    
    const exhibitID = location.pathname.split("/")[2]
    console.log(exhibitID)

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put(`http://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/exhibits/`, {
                exhibitid: exhibitID,
                exhibitname: specialExhibit.exhibitname, 
                exhibitdesc: specialExhibit.exhibitdesc, 
                exhibitpic: specialExhibit.exhibitpic,
                startdate: specialExhibit.startdate,
                enddate: specialExhibit.enddate,
                fee: specialExhibit.fee,
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
            window.alert(err.response.data.error);
        }
    }

    return(
        
        <div className="edit-special-exhibit-container">
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div>
            <div className="edit-special-exhibit-form">
                <h1>Edit Special Exhibit</h1>
                <input className="edit-special-exhibit-input" type="text" placeholder="name" onChange={handleChange} name="exhibitname"/>
                <input className="edit-special-exhibit-input" type="text" placeholder="desc" onChange={handleChange} name="exhibitdesc"/>
                <input className="edit-special-exhibit-input" type="text" placeholder="image" onChange={handleChange} name="exhibitpic"/> 
                <input className="edit-special-exhibit-input" type="date" onChange={handleChange} name="startdate"/>
                <input className="edit-special-exhibit-input" type="date" onChange={handleChange} name="enddate"/>
                <input className="edit-special-exhibit-input" type="number" placeholder="fee" onChange={handleChange} name="fee"/>
                <button className="edit-special-exhibit-formButton" onClick={handleClick} >Update</button>
                    
                </div>
            </div>
        </div>    
        </div>
    )
}

export default EditSpecialExhibit