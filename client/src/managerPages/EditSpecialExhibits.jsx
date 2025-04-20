import React from 'react'
import ManagerNav from './ManagerNav'
import { useState, useEffect } from 'react'
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
        ExhibitName:"", 
        ExhibitDesc:"", 
        ExhibitPic:"",
        StartDate:"",
        EndDate:"",
        Fee:"",
    })
    
    const navigate = useNavigate()
    const location = useLocation()
    
    const handleChange = (e) =>{ // given target to given value
        setSpecialExhibit(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(specialExhibit)
    }
    
    const exhibitID = location.pathname.split("/")[2]
    console.log(exhibitID)

    useEffect(()=>{
        const fetchSpecialExhibit = async ()=>{
            try{
                const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/exhibits/${exhibitID}`,
                    {
                        headers: {
                            'authorization': `Bearer ${token}`
                        },
                    }
                )
                console.log(res.data)
                setSpecialExhibit(res.data);
            }catch(err){
                console.log(err)
            }
        }
        fetchSpecialExhibit()
    },[])

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/exhibits/`, {
                exhibitid: exhibitID,
                exhibitname: specialExhibit.ExhibitName, 
                exhibitdesc: specialExhibit.ExhibitDesc, 
                exhibitpic: specialExhibit.ExhibitPic,
                startdate: specialExhibit.StartDate ? specialExhibit.StartDate.split("T")[0] : null,
                enddate: specialExhibit.EndDate ? specialExhibit.EndDate.split("T")[0] : null,
                fee: specialExhibit.Fee,
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
                <input className="edit-special-exhibit-input" type="text" value={specialExhibit.ExhibitName} placeholder="name" onChange={handleChange} name="ExhibitName"/>
                <input className="edit-special-exhibit-input" type="text" value={specialExhibit.ExhibitDesc} placeholder="desc" onChange={handleChange} name="ExhibitDesc"/>
                <input className="edit-special-exhibit-input" type="text" value={specialExhibit.ExhibitPic} placeholder="image" onChange={handleChange} name="ExhibitPic"/> 
                <input className="edit-special-exhibit-input" type="date" value={specialExhibit?.StartDate ? new Date(specialExhibit.StartDate).toISOString().split("T")[0] : ""} onChange={handleChange} name="StartDate"/>
                <input className="edit-special-exhibit-input" type="date" value={specialExhibit?.EndDate ? new Date(specialExhibit.EndDate).toISOString().split("T")[0] : ""} onChange={handleChange} name="EndDate"/>
                <input className="edit-special-exhibit-input" type="number" value={specialExhibit.Fee} min="0" step=".01" placeholder="fee" onChange={handleChange} name="Fee"/>
                <button className="edit-special-exhibit-formButton" onClick={handleClick} >Update</button>
                    
                </div>
            </div>
        </div>    
        </div>
    )
}

export default EditSpecialExhibit