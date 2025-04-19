import React from 'react'
import ManagerDashboard from './ManagerNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import './ManagerDashboard.css'
import './CreateExhibit.css'

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
            const res = await axios.post(`${process.env.REACT_APP_API}/exhibits`, {
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
            <div className ="create-exhibit-form-wrapper">
            <div className="create-exhibit-form">
                    <h1>Create Special Exhibit</h1>
                    <input type="text" placeholder="name" onChange={handleChange} name="exhibitname"/>
                    <input type="text" placeholder="desc" onChange={handleChange} name="exhibitdesc"/>
                    <input type="text" placeholder="image" onChange={handleChange} name="exhibitpic"/>
                    <input type="date" placeholder="Start Date" onChange={handleChange} name="startdate"/>
                    <input type="date" placeholder="End Date" onChange={handleChange} name="enddate" />
                    <input type="number" placeholder="fee" onChange={handleChange} name="fee"/>
                    <button className="formButton" onClick={handleClick} >Add</button>
                </div>
            </div>
        </div>   
        </div>
    )
}

export default CreateSpecialExhibit