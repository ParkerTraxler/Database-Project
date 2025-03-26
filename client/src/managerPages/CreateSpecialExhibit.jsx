import React from 'react'
import ManagerDashboard from './ManagerNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import './ManagerDashboard.css'

const CreateSpecialExhibit = () => {
    console.log("CreateExhibit")
    const { user } = useAuth()
        const token = user.token
        console.log(token)
        
    const [specialExhibit, setSpecialExhibit] = useState({
        exhibitname:"", 
        exhibitdesc:"", 
        exhibitpic:"",
        startdate:"", 
        enddate:"",
        fee:"",
    })

    const handleChange = (e) =>{ // given target to given value
        
        setSpecialExhibit(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log()
    }

    const navigate = useNavigate()

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.post("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/exhibits", {
                exhibitname: specialExhibit.exhibitname, 
                exhibitdesc: specialExhibit.exhibitdesc, 
                exhibitpic: specialExhibit.exhibitpic,
                startdate: specialExhibit.startdate, 
                enddate: specialExhibit.enddate,
                fee: specialExhibit.fee,
                isSpecial: 1,
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
                    <h1>Create Special Exhibit</h1>
                    <input type="text" placeholder="name" onChange={handleChange} name="exhibitname"/>
                    <input type="text" placeholder="desc" onChange={handleChange} name="exhibitdesc"/>
                    <input type="text" placeholder="image" onChange={handleChange} name="exhibitpic"/>
                    <input type="date" onChange={handleChange} name="startdate"/>
                    <input type="date" onChange={handleChange} name="enddate"/>
                    <input type="number" placeholder="fee" onChange={handleChange} name="fee"/>
                    <button className="formButton" onClick={handleClick} >Add</button>
                </div>
            </div>
            
        </div>
    )
}

export default CreateSpecialExhibit