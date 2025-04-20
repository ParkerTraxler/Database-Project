import React from 'react'
import ManagerNav from './ManagerNav'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import './ManagerDashboard.css'
import './EditExhibit.css'

const EditExhibit = () => {
    console.log("EditExhibit")
    const { user } = useAuth()
    const token = user.token
    const [exhibit, setExhibit] = useState({
        ExhibitName:"", 
        ExhibitDesc:"", 
        ExhibitPic:"",
    })
    
    const navigate = useNavigate()
    const location = useLocation()
    
    const handleChange = (e) =>{ // given target to given value
        setExhibit(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(exhibit)
    }
    
    const exhibitID = location.pathname.split("/")[2]
    console.log(exhibitID)

    useEffect(()=>{
        const fetchExhibit = async ()=>{
            try{
                const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/exhibits/${exhibitID}`,
                    {
                        headers: {
                            'authorization': `Bearer ${token}`
                        },
                    }
                )
                console.log(res.data)
                setExhibit(res.data);
            }catch(err){
                console.log(err)
            }
        }
        fetchExhibit()
    },[])

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/exhibits/`, {
                exhibitid: exhibitID,
                exhibitname: exhibit.ExhibitName, 
                exhibitdesc: exhibit.ExhibitDesc, 
                exhibitpic: exhibit.ExhibitPic,
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
        
        <div className="edit-exhibit-container">
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div>
            <div className="edit-exhibit-form">
                <h1>Edit Exhibit</h1>
                <input className="edit-exhibit-input" type="text" value={exhibit.ExhibitName} placeholder="name" onChange={handleChange} name="ExhibitName"/>
                <input className="edit-exhibit-input" type="text" value={exhibit.ExhibitDesc} placeholder="desc" onChange={handleChange} name="ExhibitDesc"/>
                <input className="edit-exhibit-input" type="text" value={exhibit.ExhibitPic} placeholder="image" onChange={handleChange} name="ExhibitPic"/> 
                <button className="edit-exhibit-formButton" onClick={handleClick} >Update</button>
                
            </div>
            </div>
        </div>  
        </div>
    )
}

export default EditExhibit